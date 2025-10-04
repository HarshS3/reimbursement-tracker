const expenseService = require('../services/expenseService');
const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/errors');

const ensureEmployeeContext = async (user) => {
  const employee = await userService.getUserById(user.id);
  if (!employee || employee.company_id !== user.companyId) {
    throw AppError.unauthorized('Unable to resolve user context');
  }
  return employee;
};

const serializeReceipt = (receipt) => ({
  id: receipt.id,
  fileUrl: receipt.file_url,
  ocrText: receipt.ocr_text,
  createdAt: receipt.created_at,
});

const serializeApproval = (approval) => ({
  id: approval.id,
  approverId: approval.approver_id,
  sequence: approval.sequence,
  isMandatory: approval.is_mandatory,
  decision: approval.decision,
  comments: approval.comments,
  decidedAt: approval.decided_at,
  approverName: approval.approver_name,
  approverEmail: approval.approver_email,
  approverRole: approval.approver_role,
});

const serializeExpense = (expense) => ({
  id: expense.id,
  employeeId: expense.employee_id,
  ruleId: expense.rule_id,
  description: expense.description,
  category: expense.category,
  expenseDate: expense.expense_date,
  paidBy: expense.paid_by,
  remarks: expense.remarks,
  amount: Number(expense.amount),
  currency: expense.currency,
  status: expense.status,
  createdAt: expense.created_at,
  receipts: (expense.receipts || []).map(serializeReceipt),
  employeeName: expense.employee_name,
  employeeEmail: expense.employee_email,
  baseCurrency: expense.base_currency,
  approvals: expense.approvals ? expense.approvals.map(serializeApproval) : undefined,
});

const createExpense = asyncHandler(async (req, res) => {
  const employee = await ensureEmployeeContext(req.user);
  const expense = await expenseService.createExpense(employee, {
    description: req.body.description,
    category: req.body.category,
    expenseDate: req.body.expenseDate,
    paidBy: req.body.paidBy,
    remarks: req.body.remarks,
    amount: req.body.amount,
    currency: req.body.currency,
    status: req.body.status,
    ruleId: req.body.ruleId,
    receipts: req.body.receipts,
  });

  res.status(201).json({ success: true, expense: serializeExpense(expense) });
});

const updateExpense = asyncHandler(async (req, res) => {
  const employee = await ensureEmployeeContext(req.user);
  const expense = await expenseService.updateExpense(employee, Number(req.params.id), req.body);
  res.json({ success: true, expense: serializeExpense(expense) });
});

const listExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.listExpenses({
    id: req.user.id,
    company_id: req.user.companyId,
    role: req.user.role,
  });
  res.json({ success: true, expenses: expenses.map(serializeExpense) });
});

const getExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseDetail(req.user, Number(req.params.id));
  res.json({ success: true, expense: serializeExpense(expense) });
});

module.exports = {
  createExpense,
  updateExpense,
  listExpenses,
  getExpense,
};
