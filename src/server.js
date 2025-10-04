const app = require('./app');
const env = require('./config/env');
const db = require('./db/pool');

async function verifyDatabaseConnection() {
  if (!env.databaseUrl) {
    // eslint-disable-next-line no-console
    console.warn('DATABASE_URL is not set. Skipping startup database connectivity check.');
    return false;
  }

  try {
    await db.query('SELECT 1');
    // eslint-disable-next-line no-console
    console.log('Database connection verified.');
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Database connectivity check failed:', err.message);
    // eslint-disable-next-line no-console
    console.error('The server will start, but database operations will fail until the database is reachable.');
    return false;
  }
}

async function start() {
  const dbReady = await verifyDatabaseConnection();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
    if (!dbReady && env.databaseUrl) {
      // eslint-disable-next-line no-console
      console.warn('PostgreSQL is unreachable. Ensure the database is running and accessible at the configured DATABASE_URL.');
    }
  });

  const signals = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      // eslint-disable-next-line no-console
      console.log(`Received ${signal}. Closing server...`);
      server.close(async () => {
        const pool = db.getPool();
        if (pool) {
          await pool.end();
        }
        process.exit(0);
      });
    });
  });
}

start();
