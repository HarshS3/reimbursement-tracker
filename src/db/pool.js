const { Pool } = require('pg');
const env = require('../config/env');

let pool;

if (env.databaseUrl) {
  pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(1);
  });
}

const ensurePool = () => {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured. Unable to perform database operations.');
  }
  return pool;
};

module.exports = {
  query: (text, params) => ensurePool().query(text, params),
  getClient: () => ensurePool().connect(),
  getPool: () => pool,
};
