const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
};

if (!env.databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set. Database connections will fail until it is configured.');
}

if (env.jwtSecret === 'change-me') {
  // eslint-disable-next-line no-console
  console.warn('Using default JWT secret. Please set JWT_SECRET in your environment.');
}

module.exports = env;
