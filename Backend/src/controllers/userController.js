const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

const formatUser = (user) => ({
  id: user.id,
  companyId: user.company_id,
  name: user.name,
  email: user.email,
  role: user.role,
  managerId: user.manager_id,
  createdAt: user.created_at,
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers(req.user.companyId);
  res.json({ success: true, users: users.map(formatUser) });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, managerId } = req.body;
  const user = await userService.createUser(req.user.companyId, { name, email, password, role, managerId });
  res.status(201).json({ success: true, user: formatUser(user) });
});

const updateUser = asyncHandler(async (req, res) => {
  const { role, managerId, name } = req.body;
  const user = await userService.updateUser(req.user.companyId, Number(req.params.id), { role, managerId, name });
  res.json({ success: true, user: formatUser(user) });
});

module.exports = {
  listUsers,
  createUser,
  updateUser,
};
