const ruleService = require('../services/ruleService');
const asyncHandler = require('../utils/asyncHandler');

const createRule = asyncHandler(async (req, res) => {
  const { name, description, isManagerApprover, minApprovalPercentage } = req.body;
  const rule = await ruleService.createRule(req.user.companyId, {
    name,
    description,
    isManagerApprover,
    minApprovalPercentage,
  });
  res.status(201).json({ success: true, rule });
});

const addApprovers = asyncHandler(async (req, res) => {
  const { approvers } = req.body;
  await ruleService.addApprovers(Number(req.params.id), req.user.companyId, approvers);
  res.json({ success: true });
});

const listRules = asyncHandler(async (req, res) => {
  const rules = await ruleService.listRules(req.user.companyId);
  res.json({ success: true, rules });
});

module.exports = {
  createRule,
  addApprovers,
  listRules,
};
