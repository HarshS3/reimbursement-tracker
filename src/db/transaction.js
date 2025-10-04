const { getPool } = require('./pool');

async function withTransaction(callback) {
  const pool = getPool();
  if (!pool) {
    throw new Error('DATABASE_URL is not configured. Unable to perform database operations.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = withTransaction;
