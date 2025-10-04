const authService = require('../services/authService');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

const shapeUser = (user) => ({
  id: user.id,
  companyId: user.company_id,
  name: user.name,
  email: user.email,
  role: user.role,
  managerId: user.manager_id || null,
  createdAt: user.created_at,
});

const signup = asyncHandler(async (req, res) => {
  const { companyName, baseCurrency, country, adminName, email, password } = req.body;
  const { company, user } = await authService.signup({ companyName, baseCurrency, country, adminName, email, password });

  const shapedUser = shapeUser(user);
  const token = signToken({
    id: shapedUser.id,
    companyId: shapedUser.companyId,
    role: shapedUser.role,
    name: shapedUser.name,
    managerId: shapedUser.managerId,
  });

  res.status(201).json({
    success: true,
    company: {
      id: company.id,
      name: company.name,
      baseCurrency: company.base_currency,
      country: company.country,
      createdAt: company.created_at,
    },
    user: shapedUser,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login({ email, password });

  const shapedUser = shapeUser(user);
  const token = signToken({
    id: shapedUser.id,
    companyId: shapedUser.companyId,
    role: shapedUser.role,
    name: shapedUser.name,
    managerId: shapedUser.managerId,
  });

  res.json({
    success: true,
    user: {
      ...shapedUser,
      company: {
        id: user.company_id,
        name: user.company_name,
        baseCurrency: user.base_currency,
        country: user.country,
      },
    },
    token,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // In a real implementation we would generate a reset token and email it.
  // For now just pretend the flow succeeds to unblock frontend integration.
  res.json({
    success: true,
    message: `If an account exists for ${email}, a password reset email has been sent.`,
  });
});

module.exports = {
  signup,
  login,
  forgotPassword,
};
