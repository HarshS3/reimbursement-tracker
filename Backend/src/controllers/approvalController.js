const approvalService = require('../services/approvalService');
const asyncHandler = require('../utils/asyncHandler');

const listApprovals = asyncHandler(async (req, res) => {
  const approvals = await approvalService.listPendingApprovals({
    id: req.user.id,
    companyId: req.user.companyId,
    role: req.user.role,
  });
  res.json({ success: true, approvals });
});

const decideApproval = asyncHandler(async (req, res) => {
  const { decision, comments } = req.body;
  const result = await approvalService.decideApproval(
    { id: req.user.id, companyId: req.user.companyId, role: req.user.role },
    Number(req.params.id),
    decision,
    comments
  );

  res.json({ success: true, approval: result.approval, expenseStatus: result.expenseStatus });
});

module.exports = {
  listApprovals,
  decideApproval,
};
