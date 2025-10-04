const AppError = require('../utils/errors');
const { verifyToken } = require('../utils/jwt');

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (!token || scheme !== 'Bearer') {
      if (required) {
        return next(AppError.unauthorized('Authorization header missing or malformed'));
      }
      req.user = null;
      return next();
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(AppError.unauthorized('Invalid or expired token'));
    }

    req.user = payload;
    return next();
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    const userRole = String(req.user.role || '').toLowerCase();
    const allowed = roles.length === 0
      ? true
      : roles.map(r => String(r).toLowerCase()).includes(userRole);

    if (allowed) {
      return next();
    }

    return next(AppError.forbidden('Insufficient permissions'));
  };
}

module.exports = {
  auth,
  requireRole,
};
