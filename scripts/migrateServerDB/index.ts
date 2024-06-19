import * as dotenv from 'dotenv';
import * as migrator from 'drizzle-orm/neon-serverless/migrator';
import { join } from 'node:path';

import { serverDB } from '../../src/database/server/core/db';

// Read the `.env` file if it exists, or a file specified by the
// dotenv_config_path parameter that's passed to Node.js
dotenv.config();

/**
 * Transforms the sign-up request data to match the backend's expected format.
 *
 * @param {SignUpRequest} signUpData - The original sign-up request data.
 *
 * @returns {Object} The transformed sign-up request data with the following changes:
 * - `firstName` is mapped to `first_name`
 * - `lastName` is mapped to `last_name`
 * - `email` is mapped to `username`
 * - All other properties remain unchanged.
 */
const runMigrations = async () => {
  await migrator.migrate(serverDB, {
    migrationsFolder: join(__dirname, '../../src/database/server/migrations'),
  });
  console.log('✅ database migration pass.');
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
};

let connectionString = process.env.DATABASE_URL;

// only migrate database if the connection string is available
if (connectionString) {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  runMigrations().catch((err) => {
    console.error('❌ Database migrate failed:', err);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
} else {
  console.log('🟢 not find database env, migration skipped');
}
