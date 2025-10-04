const db = require('../db/pool');
const withTransaction = require('../db/transaction');
const AppError = require('../utils/errors');
const { hashPassword, verifyPassword } = require('../utils/hash');

async function signup({ companyName, baseCurrency, country, adminName, email, password }) {
  if (!companyName || !baseCurrency || !country || !adminName || !email || !password) {
    throw AppError.badRequest('Missing required signup fields');
  }

  const normalizedCountry = country.trim();
  if (!normalizedCountry) {
    throw AppError.badRequest('Country must be provided');
  }

  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw AppError.conflict('Email is already in use');
  }

  const passwordHash = await hashPassword(password);

  const result = await withTransaction(async (client) => {
    const companyRes = await client.query(
      'INSERT INTO companies (name, base_currency, country) VALUES ($1, $2, $3) RETURNING id, name, base_currency, country, created_at',
      [companyName, baseCurrency, normalizedCountry]
    );

    const company = companyRes.rows[0];

    const userRes = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'Admin')
       RETURNING id, company_id, name, email, role, created_at`,
      [company.id, adminName, email.toLowerCase(), passwordHash]
    );

    return { company, user: userRes.rows[0] };
  });

  return result;
}

async function login({ email, password }) {
  if (!email || !password) {
    throw AppError.badRequest('Email and password are required');
  }

  const userRes = await db.query(
    `SELECT u.id, u.company_id, u.name, u.email, u.password_hash, u.role, u.manager_id,
            c.name AS company_name, c.base_currency, c.country
     FROM users u
     JOIN companies c ON c.id = u.company_id
     WHERE u.email = $1`,
    [email.toLowerCase()]
  );

  if (userRes.rows.length === 0) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const user = userRes.rows[0];
  const match = await verifyPassword(password, user.password_hash);
  if (!match) {
    throw AppError.unauthorized('Invalid credentials');
  }

  delete user.password_hash;
  return user;
}

module.exports = {
  signup,
  login,
};
