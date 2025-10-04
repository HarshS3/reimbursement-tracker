const db = require('../db/pool');
const withTransaction = require('../db/transaction');
const AppError = require('../utils/errors');
const { ensureRuleBelongsToCompany, getRuleApprovers } = require('./ruleService');

async function listPendingApprovals(user) {
  const res = await db.query(
    `SELECT ea.id, ea.expense_id, ea.sequence, ea.is_mandatory,
            ea.decision, ea.comments, ea.decided_at,
            e.description, e.amount, e.currency, e.status,
            e.expense_date, e.employee_id,
            u.name AS employee_name, u.email AS employee_email
     FROM expense_approvals ea
     JOIN expenses e ON e.id = ea.expense_id
     JOIN users u ON u.id = e.employee_id
     WHERE ea.approver_id = $1 AND ea.decision = 'Pending'
     ORDER BY e.expense_date DESC` ,
    [user.id]
  );

  return res.rows;
}

async function decideApproval(user, approvalId, decision, comments) {
  if (!['Approved', 'Rejected'].includes(decision)) {
    throw AppError.badRequest('Decision must be Approved or Rejected');
  }

  const result = await withTransaction(async (client) => {
    const approvalRes = await client.query(
      `SELECT ea.*, e.rule_id, e.status, e.employee_id, u.company_id
       FROM expense_approvals ea
       JOIN expenses e ON e.id = ea.expense_id
       JOIN users u ON u.id = e.employee_id
       WHERE ea.id = $1 FOR UPDATE`,
      [approvalId]
    );

    if (approvalRes.rows.length === 0) {
      throw AppError.notFound('Approval task not found');
    }

    const approval = approvalRes.rows[0];

    if (approval.approver_id !== user.id) {
      throw AppError.forbidden('Cannot act on approvals assigned to other users');
    }

    if (approval.decision !== 'Pending') {
      throw AppError.badRequest('Approval already decided');
    }

    if (approval.status !== 'Waiting Approval') {
      throw AppError.badRequest('Expense is no longer pending approval');
    }

    const rule = await ensureRuleBelongsToCompany(approval.rule_id, approval.company_id, client);
    const ruleApprovers = await getRuleApprovers(approval.rule_id);

    const approvalsRes = await client.query(
      `SELECT * FROM expense_approvals WHERE expense_id = $1 FOR UPDATE`,
      [approval.expense_id]
    );

    const approvals = approvalsRes.rows;

    const hasSequence = approvals.some((a) => a.sequence !== null);
    if (hasSequence) {
      const priorPending = approvals
        .filter((a) => a.sequence !== null && a.sequence < approval.sequence)
        .find((a) => a.decision !== 'Approved');
      if (priorPending) {
        throw AppError.badRequest('Awaiting previous approvers in the sequence');
      }
    }

    await client.query(
      `UPDATE expense_approvals
         SET decision = $1,
             comments = $2,
             decided_at = NOW()
       WHERE id = $3`,
      [decision, comments || null, approvalId]
    );

    approval.decision = decision;
    approval.comments = comments || null;
    approval.decided_at = new Date().toISOString();

    const updatedApprovalsRes = await client.query(
      `SELECT ea.*, u.role
       FROM expense_approvals ea
       JOIN users u ON u.id = ea.approver_id
       WHERE expense_id = $1`,
      [approval.expense_id]
    );

    const updatedApprovals = updatedApprovalsRes.rows;

    const newStatus = determineExpenseStatus(rule, ruleApprovers, updatedApprovals);

    if (newStatus) {
      await client.query(`UPDATE expenses SET status = $1 WHERE id = $2`, [newStatus, approval.expense_id]);
    }

    return { approval, expenseStatus: newStatus || approval.status };
  });

  return result;
}

function determineExpenseStatus(rule, ruleApprovers, approvals) {
  const totalApprovers = approvals.length;
  const approved = approvals.filter((a) => a.decision === 'Approved');
  const rejected = approvals.filter((a) => a.decision === 'Rejected');
  const pending = approvals.filter((a) => a.decision === 'Pending');

  if (rejected.length > 0) {
    return 'Rejected';
  }

  const pendingMandatory = approvals.some((a) => a.is_mandatory && a.decision === 'Pending');
  if (pendingMandatory) {
    return null;
  }

  if (rule.min_approval_percentage !== null) {
    const approvalPercentage = (approved.length / totalApprovers) * 100;
    if (approvalPercentage >= rule.min_approval_percentage) {
      return 'Approved';
    }
    return null;
  }

  if (pending.length === 0 && approved.length === totalApprovers) {
    return 'Approved';
  }

  return null;
}

module.exports = {
  listPendingApprovals,
  decideApproval,
};
