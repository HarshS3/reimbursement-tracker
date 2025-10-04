const db = require('../db/pool');
const withTransaction = require('../db/transaction');
const AppError = require('../utils/errors');

async function createRule(companyId, { name, description, isManagerApprover = false, minApprovalPercentage = null }) {
  if (!name) {
    throw AppError.badRequest('Rule name is required');
  }

  let minPercentage = minApprovalPercentage;
  if (minPercentage !== null && typeof minPercentage !== 'undefined') {
    const numeric = Number(minPercentage);
    if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
      throw AppError.badRequest('minApprovalPercentage must be between 0 and 100');
    }
    minPercentage = numeric;
  } else {
    minPercentage = null;
  }

  const res = await db.query(
    `INSERT INTO approval_rules (company_id, name, description, is_manager_approver, min_approval_percentage)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, company_id, name, description, is_manager_approver, min_approval_percentage, created_at`,
    [companyId, name, description || null, isManagerApprover, minPercentage]
  );

  return res.rows[0];
}

async function ensureRuleBelongsToCompany(ruleId, companyId, client = db) {
  const res = await client.query('SELECT id, company_id, name, is_manager_approver, min_approval_percentage FROM approval_rules WHERE id = $1', [ruleId]);
  if (res.rows.length === 0 || res.rows[0].company_id !== companyId) {
    throw AppError.notFound('Rule not found');
  }
  return res.rows[0];
}

async function addApprovers(ruleId, companyId, approvers) {
  if (!Array.isArray(approvers) || approvers.length === 0) {
    throw AppError.badRequest('Approvers array is required');
  }

  await withTransaction(async (client) => {
    await ensureRuleBelongsToCompany(ruleId, companyId, client);

    const approverIds = approvers.map((a) => a.approverId);
    const uniqueApproverIds = [...new Set(approverIds)];
    if (uniqueApproverIds.length !== approvers.length) {
      throw AppError.badRequest('Duplicate approvers are not allowed');
    }

    const userCheck = await client.query(
      `SELECT id FROM users WHERE id = ANY($1) AND company_id = $2`,
      [approverIds, companyId]
    );

    if (userCheck.rows.length !== approvers.length) {
      throw AppError.badRequest('Approvers must belong to the same company');
    }

    await client.query('DELETE FROM rule_approvers WHERE rule_id = $1', [ruleId]);

    const insertPromises = approvers.map((approver) => {
      const sequence = typeof approver.sequence === 'number' ? approver.sequence : null;
      const isMandatory = Boolean(approver.isMandatory);
      return client.query(
        `INSERT INTO rule_approvers (rule_id, approver_id, sequence, is_mandatory)
         VALUES ($1, $2, $3, $4)`,
        [ruleId, approver.approverId, sequence, isMandatory]
      );
    });

    await Promise.all(insertPromises);
  });
}

async function listRules(companyId) {
  const rulesRes = await db.query(
    `SELECT id, company_id, name, description, is_manager_approver, min_approval_percentage, created_at
     FROM approval_rules
     WHERE company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );

  const ruleIds = rulesRes.rows.map((row) => row.id);
  let approvers = [];
  if (ruleIds.length > 0) {
    const approverRes = await db.query(
      `SELECT ra.id, ra.rule_id, ra.approver_id, ra.sequence, ra.is_mandatory,
              u.name AS approver_name, u.email AS approver_email, u.role AS approver_role
       FROM rule_approvers ra
       JOIN users u ON u.id = ra.approver_id
       WHERE ra.rule_id = ANY($1)
       ORDER BY COALESCE(ra.sequence, 999999), ra.id`,
      [ruleIds]
    );
    approvers = approverRes.rows;
  }

  const ruleMap = new Map();
  rulesRes.rows.forEach((rule) => {
    ruleMap.set(rule.id, { ...rule, approvers: [] });
  });

  approvers.forEach((row) => {
    const entry = ruleMap.get(row.rule_id);
    if (entry) {
      entry.approvers.push({
        id: row.id,
        approverId: row.approver_id,
        sequence: row.sequence,
        isMandatory: row.is_mandatory,
        name: row.approver_name,
        email: row.approver_email,
        role: row.approver_role,
      });
    }
  });

  return Array.from(ruleMap.values());
}

async function getRuleById(ruleId) {
  const res = await db.query('SELECT * FROM approval_rules WHERE id = $1', [ruleId]);
  return res.rows[0] || null;
}

async function getRuleApprovers(ruleId, client = db) {
  const res = await client.query(
    `SELECT ra.id, ra.rule_id, ra.approver_id, ra.sequence, ra.is_mandatory,
            u.company_id, u.name, u.email, u.role
     FROM rule_approvers ra
     JOIN users u ON u.id = ra.approver_id
     WHERE ra.rule_id = $1
     ORDER BY COALESCE(ra.sequence, 999999), ra.id`,
    [ruleId]
  );
  return res.rows;
}

module.exports = {
  createRule,
  addApprovers,
  listRules,
  ensureRuleBelongsToCompany,
  getRuleById,
  getRuleApprovers,
};
