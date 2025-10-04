const db = require('../db/pool');
const withTransaction = require('../db/transaction');
const AppError = require('../utils/errors');
const {
  ensureRuleBelongsToCompany,
  getRuleApprovers,
} = require('./ruleService');
const { getUserById, getTeamMemberIds } = require('./userService');
const { convertAmount } = require('./exchangeRateService');

const EXPENSE_SELECT_FIELDS = `
  e.id, e.employee_id, e.rule_id, e.description, e.category,
  e.expense_date, e.paid_by, e.remarks, e.amount, e.currency,
  e.original_amount, e.original_currency,
  e.status, e.created_at
`;

const EXPENSE_RETURN_FIELDS = 'id, employee_id, rule_id, description, category, expense_date, paid_by, remarks, amount, currency, original_amount, original_currency, status, created_at';

function roundToTwo(value) {
  return Math.round(Number(value) * 100) / 100;
}

async function fetchExpenseById(expenseId) {
  const res = await db.query(
  `SELECT ${EXPENSE_SELECT_FIELDS}, u.company_id, c.base_currency
    FROM expenses e
    JOIN users u ON u.id = e.employee_id
    JOIN companies c ON c.id = u.company_id
    WHERE e.id = $1`,
    [expenseId]
  );
  return res.rows[0] || null;
}

async function replaceReceipts(client, expenseId, receipts) {
  await client.query('DELETE FROM receipts WHERE expense_id = $1', [expenseId]);

  if (!Array.isArray(receipts) || receipts.length === 0) {
    return [];
  }

  const insertPromises = receipts.map((receipt) => {
    const fileUrl = receipt.fileUrl || receipt.file_url;
    if (!fileUrl) {
      throw AppError.badRequest('Each receipt requires a fileUrl');
    }
    const ocrText = receipt.ocrText || receipt.ocr_text || null;
    return client.query(
      `INSERT INTO receipts (expense_id, file_url, ocr_text)
       VALUES ($1, $2, $3)
       RETURNING id, expense_id, file_url, ocr_text, created_at`,
      [expenseId, fileUrl, ocrText]
    );
  });

  const results = await Promise.all(insertPromises);
  return results.map((resRow) => resRow.rows[0]);
}

async function getReceiptsByExpenseIds(expenseIds, client = db) {
  if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
    return new Map();
  }

  const res = await client.query(
    `SELECT id, expense_id, file_url, ocr_text, created_at
     FROM receipts
     WHERE expense_id = ANY($1::int[])
     ORDER BY created_at ASC`,
    [expenseIds]
  );

  const map = new Map();
  res.rows.forEach((row) => {
    if (!map.has(row.expense_id)) {
      map.set(row.expense_id, []);
    }
    map.get(row.expense_id).push(row);
  });

  return map;
}

function buildApproverEntries(rule, ruleApprovers, employee) {
  const approvers = [];
  const hasSequence = ruleApprovers.some((ra) => ra.sequence !== null && typeof ra.sequence !== 'undefined');

  if (rule.is_manager_approver) {
    if (!employee.manager_id) {
      throw AppError.badRequest('Employee does not have a manager assigned but the rule requires manager approval');
    }
    const managerExists = ruleApprovers.some((ra) => ra.approver_id === employee.manager_id);
    if (!managerExists) {
      approvers.push({
        approver_id: employee.manager_id,
        sequence: hasSequence ? 0 : null,
        is_mandatory: true,
      });
    }
  }

  ruleApprovers.forEach((ra) => {
    approvers.push({
      approver_id: ra.approver_id,
      sequence: hasSequence ? ra.sequence : null,
      is_mandatory: ra.is_mandatory,
    });
  });

  // Deduplicate approvers keeping first occurrence
  const seen = new Set();
  return approvers.filter((entry) => {
    if (seen.has(entry.approver_id)) {
      return false;
    }
    seen.add(entry.approver_id);
    return true;
  });
}

async function createExpense(employee, payload) {
  const {
    description,
    category,
    expenseDate,
    paidBy,
    remarks,
    amount,
    currency,
    status = 'Draft',
    ruleId,
    receipts = [],
  } = payload;

  if (!description || !expenseDate || !amount || !currency) {
    throw AppError.badRequest('Description, expenseDate, amount, and currency are required');
  }

  const statusNormalized = status || 'Draft';
  if (!['Draft', 'Waiting Approval', 'Approved', 'Rejected'].includes(statusNormalized)) {
    throw AppError.badRequest('Invalid expense status');
  }

  if (statusNormalized !== 'Draft' && !ruleId) {
    throw AppError.badRequest('ruleId is required when submitting for approval');
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw AppError.badRequest('Amount must be a positive number');
  }

  const baseCurrency = (employee.base_currency || '').toUpperCase();
  if (!baseCurrency) {
    throw AppError.internal('Company base currency not configured');
  }

  const originalCurrency = currency.toUpperCase();
  const originalAmount = roundToTwo(numericAmount);

  const { convertedAmount } = await convertAmount(originalAmount, originalCurrency, baseCurrency);
  const finalAmount = roundToTwo(convertedAmount);

  const result = await withTransaction(async (client) => {
    let rule = null;
    let ruleApprovers = [];

    if (ruleId) {
      rule = await ensureRuleBelongsToCompany(ruleId, employee.company_id, client);
      ruleApprovers = await getRuleApprovers(ruleId, client);
    }

    const insertRes = await client.query(
      `INSERT INTO expenses (
         employee_id, rule_id, description, category, expense_date,
         paid_by, remarks, amount, currency, original_amount, original_currency, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING ${EXPENSE_RETURN_FIELDS}`,
      [
        employee.id,
        ruleId || null,
        description,
        category || null,
        expenseDate,
        paidBy || null,
        remarks || null,
        finalAmount,
        baseCurrency,
        originalAmount,
        originalCurrency,
        statusNormalized === 'Draft' ? 'Draft' : 'Waiting Approval',
      ]
    );

    const expense = insertRes.rows[0];
    expense.receipts = await replaceReceipts(client, expense.id, receipts);

    if (statusNormalized !== 'Draft' && rule) {
      await createExpenseApprovals(client, expense.id, rule, ruleApprovers, employee);
    }

    return expense;
  });

  return result;
}

async function createExpenseApprovals(client, expenseId, rule, ruleApprovers, employee) {
  await client.query('DELETE FROM expense_approvals WHERE expense_id = $1', [expenseId]);
  const approvers = buildApproverEntries(rule, ruleApprovers, employee);

  if (approvers.length === 0) {
    throw AppError.badRequest('Approval rule does not have any approvers configured');
  }

  const inserts = approvers.map((entry) => {
    const sequence = entry.sequence !== null && entry.sequence !== undefined ? entry.sequence : null;
    const seqValue = sequence === null ? null : sequence;
    return client.query(
      `INSERT INTO expense_approvals (expense_id, approver_id, sequence, is_mandatory)
       VALUES ($1, $2, $3, $4)`,
      [expenseId, entry.approver_id, seqValue, entry.is_mandatory || false]
    );
  });

  await Promise.all(inserts);
}

async function updateExpense(employee, expenseId, updates) {
  const expense = await fetchExpenseById(expenseId);
  if (!expense || expense.company_id !== employee.company_id) {
    throw AppError.notFound('Expense not found');
  }

  if (expense.employee_id !== employee.id) {
    throw AppError.forbidden('You can only update your own expenses');
  }

  if (expense.status !== 'Draft') {
    throw AppError.badRequest('Only draft expenses can be updated');
  }

  const fields = [];
  const values = [];

  const baseCurrency = (expense.base_currency || '').toUpperCase();
  if (!baseCurrency) {
    throw AppError.internal('Company base currency not configured');
  }

  const allowedFields = {
    description: 'description',
    category: 'category',
    expenseDate: 'expense_date',
    paidBy: 'paid_by',
    remarks: 'remarks',
    ruleId: 'rule_id',
  };

  for (const [key, column] of Object.entries(allowedFields)) {
    if (Object.prototype.hasOwnProperty.call(updates, key) && typeof updates[key] !== 'undefined') {
      if (key === 'ruleId' && updates[key] !== null) {
        await ensureRuleBelongsToCompany(updates[key], employee.company_id);
      }
      fields.push(`${column} = $${fields.length + 1}`);
      values.push(updates[key]);
    }
  }

  let amountCurrencyUpdated = false;
  let newOriginalAmount = expense.original_amount ? Number(expense.original_amount) : Number(expense.amount);
  let newOriginalCurrency = (expense.original_currency || expense.currency || baseCurrency || '').toUpperCase();

  if (Object.prototype.hasOwnProperty.call(updates, 'amount')) {
    const numericAmount = Number(updates.amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      throw AppError.badRequest('Amount must be a positive number');
    }
    newOriginalAmount = roundToTwo(numericAmount);
    amountCurrencyUpdated = true;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'currency')) {
    if (!updates.currency) {
      throw AppError.badRequest('Currency is required when updating expense currency');
    }
    newOriginalCurrency = String(updates.currency).toUpperCase();
    amountCurrencyUpdated = true;
  }

  let convertedAmount = expense.amount ? Number(expense.amount) : newOriginalAmount;

  if (amountCurrencyUpdated) {
    const conversion = await convertAmount(newOriginalAmount, newOriginalCurrency, baseCurrency);
    convertedAmount = roundToTwo(conversion.convertedAmount);

    fields.push(`amount = $${fields.length + 1}`);
    values.push(convertedAmount);

    fields.push(`currency = $${fields.length + 1}`);
    values.push(baseCurrency);

    fields.push(`original_amount = $${fields.length + 1}`);
    values.push(newOriginalAmount);

    fields.push(`original_currency = $${fields.length + 1}`);
    values.push(newOriginalCurrency);
  }

  let submit = false;
  if (updates.status === 'Waiting Approval') {
    submit = true;
  } else if (updates.status && updates.status !== 'Draft') {
    throw AppError.badRequest('Status can only transition from Draft to Waiting Approval via update');
  }

  const receiptsProvided = Object.prototype.hasOwnProperty.call(updates, 'receipts');

  const result = await withTransaction(async (client) => {
    let newRule = null;
    let ruleApprovers = [];

    if (fields.length > 0) {
      values.push(expenseId);
      const updateRes = await client.query(
        `UPDATE expenses SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING ${EXPENSE_RETURN_FIELDS}`,
        values
      );
      Object.assign(expense, updateRes.rows[0]);
      expense.base_currency = baseCurrency;
    }

    if (submit) {
      const ruleId = expense.rule_id || updates.ruleId;
      if (!ruleId) {
        throw AppError.badRequest('ruleId is required to submit expense for approval');
      }
      newRule = await ensureRuleBelongsToCompany(ruleId, employee.company_id, client);
      ruleApprovers = await getRuleApprovers(ruleId, client);

      await client.query(
        `UPDATE expenses SET status = 'Waiting Approval' WHERE id = $1`,
        [expenseId]
      );
      expense.status = 'Waiting Approval';

      const employeeFull = await getUserById(employee.id);
      await createExpenseApprovals(client, expenseId, newRule, ruleApprovers, employeeFull);
    }

    if (receiptsProvided) {
      expense.receipts = await replaceReceipts(client, expenseId, updates.receipts || []);
    }

    return expense;
  });

  if (typeof result.receipts === 'undefined') {
    const receiptMap = await getReceiptsByExpenseIds([expenseId]);
    result.receipts = receiptMap.get(expenseId) || [];
  }

  return result;
}

async function listExpenses(user) {
  let query = `SELECT ${EXPENSE_SELECT_FIELDS}, c.base_currency,
      u.name AS employee_name, u.email AS employee_email
    FROM expenses e
    JOIN users u ON u.id = e.employee_id
    JOIN companies c ON c.id = u.company_id`;
  const clauses = [];
  const params = [];

  if (user.role === 'Employee') {
    clauses.push('e.employee_id = $1');
    params.push(user.id);
  } else if (user.role === 'Manager') {
    const teamIds = await getTeamMemberIds(user.id);
    clauses.push('e.employee_id = ANY($1::int[])');
    params.push([user.id, ...teamIds]);
  } else if (user.role === 'Admin') {
    clauses.push('u.company_id = $1');
    params.push(user.company_id);
  }

  if (clauses.length > 0) {
    query += ` WHERE ${clauses.join(' AND ')}`;
  }

  query += ' ORDER BY e.created_at DESC';

  const res = await db.query(query, params);
  const expenses = res.rows;

  if (expenses.length === 0) {
    return [];
  }

  const receiptMap = await getReceiptsByExpenseIds(expenses.map((row) => row.id));
  expenses.forEach((expense) => {
    expense.receipts = receiptMap.get(expense.id) || [];
  });

  return expenses;
}

async function getExpenseWithApprovals(expenseId) {
  const expenseRes = await db.query(
    `SELECT ${EXPENSE_SELECT_FIELDS}, u.company_id, u.name AS employee_name, u.email AS employee_email,
            c.base_currency
     FROM expenses e
     JOIN users u ON u.id = e.employee_id
     JOIN companies c ON c.id = u.company_id
     WHERE e.id = $1`,
    [expenseId]
  );

  if (expenseRes.rows.length === 0) {
    return null;
  }

  const expense = expenseRes.rows[0];

  const approvalsRes = await db.query(
    `SELECT ea.id, ea.approver_id, ea.sequence, ea.is_mandatory,
            ea.decision, ea.comments, ea.decided_at,
            u.name AS approver_name, u.email AS approver_email, u.role AS approver_role
     FROM expense_approvals ea
     JOIN users u ON u.id = ea.approver_id
     WHERE ea.expense_id = $1
     ORDER BY COALESCE(ea.sequence, 999999), ea.id`,
    [expenseId]
  );

  expense.approvals = approvalsRes.rows;
  const receiptMap = await getReceiptsByExpenseIds([expenseId]);
  expense.receipts = receiptMap.get(expenseId) || [];
  return expense;
}

async function getExpenseDetail(user, expenseId) {
  const expense = await getExpenseWithApprovals(expenseId);
  if (!expense) {
    throw AppError.notFound('Expense not found');
  }

  if (user.role === 'Employee') {
    if (expense.employee_id !== user.id) {
      throw AppError.forbidden('You can only access your own expenses');
    }
  } else if (user.role === 'Manager') {
    const teamIds = await getTeamMemberIds(user.id);
    if (![user.id, ...teamIds].includes(expense.employee_id)) {
      throw AppError.forbidden('Expense is outside your team');
    }
  } else if (user.role === 'Admin') {
    if (expense.company_id !== user.companyId) {
      throw AppError.forbidden('Expense belongs to another company');
    }
  } else {
    throw AppError.forbidden('Unsupported role');
  }

  return expense;
}

module.exports = {
  createExpense,
  updateExpense,
  listExpenses,
  fetchExpenseById,
  createExpenseApprovals,
  getExpenseWithApprovals,
  getExpenseDetail,
  getReceiptsByExpenseIds,
};
