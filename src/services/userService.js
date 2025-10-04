const db = require('../db/pool');
const AppError = require('../utils/errors');
const { hashPassword } = require('../utils/hash');

const PUBLIC_FIELDS = 'id, company_id, name, email, role, manager_id, created_at';

async function getUserById(id) {
  const res = await db.query(`SELECT ${PUBLIC_FIELDS}, password_hash FROM users WHERE id = $1`, [id]);
  return res.rows[0] || null;
}

async function listUsers(companyId) {
  const res = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE company_id = $1 ORDER BY created_at ASC`, [companyId]);
  return res.rows;
}

async function createUser(companyId, { name, email, password, role, managerId }) {
  if (!name || !email || !password || !role) {
    throw AppError.badRequest('Name, email, password, and role are required');
  }

  if (!['Admin', 'Manager', 'Employee'].includes(role)) {
    throw AppError.badRequest('Invalid role');
  }

  const existing = await db.query('SELECT 1 FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw AppError.conflict('Email already in use');
  }

  let managerIdToSet = managerId || null;
  if (managerIdToSet) {
    const manager = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1 AND company_id = $2`, [managerIdToSet, companyId]);
    if (manager.rows.length === 0) {
      throw AppError.badRequest('Manager must belong to the same company');
    }
  }

  const passwordHash = await hashPassword(password);

  const res = await db.query(
    `INSERT INTO users (company_id, name, email, password_hash, role, manager_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${PUBLIC_FIELDS}`,
    [companyId, name, email.toLowerCase(), passwordHash, role, managerIdToSet]
  );

  return res.rows[0];
}

async function updateUser(companyId, userId, { role, managerId, name }) {
  const user = await getUserById(userId);
  if (!user || user.company_id !== companyId) {
    throw AppError.notFound('User not found');
  }

  const updates = [];
  const values = [];

  if (role) {
    if (!['Admin', 'Manager', 'Employee'].includes(role)) {
      throw AppError.badRequest('Invalid role');
    }
    updates.push(`role = $${updates.length + 1}`);
    values.push(role);
  }

  if (typeof managerId !== 'undefined') {
    if (managerId === null) {
      updates.push(`manager_id = $${updates.length + 1}`);
      values.push(null);
    } else {
      const manager = await db.query(`SELECT id FROM users WHERE id = $1 AND company_id = $2`, [managerId, companyId]);
      if (manager.rows.length === 0) {
        throw AppError.badRequest('Manager must belong to the same company');
      }
      updates.push(`manager_id = $${updates.length + 1}`);
      values.push(managerId);
    }
  }

  if (name) {
    updates.push(`name = $${updates.length + 1}`);
    values.push(name);
  }

  if (updates.length === 0) {
    return { ...user, password_hash: undefined };
  }

  values.push(userId, companyId);

  const res = await db.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${updates.length + 1} AND company_id = $${updates.length + 2}
     RETURNING ${PUBLIC_FIELDS}`,
    values
  );

  return res.rows[0];
}

async function getTeamMemberIds(managerId) {
  const res = await db.query('SELECT id FROM users WHERE manager_id = $1', [managerId]);
  return res.rows.map((row) => row.id);
}

module.exports = {
  getUserById,
  listUsers,
  createUser,
  updateUser,
  getTeamMemberIds,
};
