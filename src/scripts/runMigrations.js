const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const env = require('../config/env');

const migrationsDir = path.resolve(__dirname, '../../migrations');

const shouldUseSsl = env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

async function runMigrations() {
  if (!env.databaseUrl) {
    // eslint-disable-next-line no-console
    console.error('DATABASE_URL is not configured. Set it in your environment before running migrations.');
    process.exit(1);
  }

  if (!fs.existsSync(migrationsDir)) {
    // eslint-disable-next-line no-console
    console.error(`Migrations directory not found at ${migrationsDir}`);
    process.exit(1);
  }

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql') && !file.startsWith('000_create_database'))
    .sort();

  if (migrationFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No runnable migration files found. Skipping.');
    return;
  }

  const pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: shouldUseSsl,
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // eslint-disable-next-line no-console
    console.log(`Applying ${migrationFiles.length} migration(s) to ${env.databaseUrl}...`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      // eslint-disable-next-line no-console
      console.log(`\n▶ Running ${file}`);
      await client.query(sql);
    }

    await client.query('COMMIT');
    // eslint-disable-next-line no-console
    console.log('\n✅ Migrations applied successfully.');
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      // eslint-disable-next-line no-console
      console.error('Failed to rollback transaction after error:', rollbackError.message);
    }

    // eslint-disable-next-line no-console
    console.error('\n❌ Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Migration runner encountered an unexpected error:', error.message);
  process.exit(1);
});
