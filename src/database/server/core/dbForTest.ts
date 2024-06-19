import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import * as migrator from 'drizzle-orm/neon-serverless/migrator';
import { drizzle as nodeDrizzle } from 'drizzle-orm/node-postgres';
import * as nodeMigrator from 'drizzle-orm/node-postgres/migrator';
import { join } from 'node:path';
import { Pool as NodePool } from 'pg';
import ws from 'ws';

import { serverDBEnv } from '@/config/db';

import * as schema from '../schemas/lobechat';

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
export const getTestDBInstance = async () => {
  let connectionString = serverDBEnv.DATABASE_TEST_URL;

  if (!connectionString) {
    throw new Error(`You are try to use database, but "DATABASE_TEST_URL" is not set correctly`);
  }

  if (serverDBEnv.DATABASE_DRIVER === 'node') {
    const client = new NodePool({ connectionString });

    const db = nodeDrizzle(client, { schema });

    await nodeMigrator.migrate(db, {
      migrationsFolder: join(__dirname, '../migrations'),
    });

    return db;
  }

  // https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined
  neonConfig.webSocketConstructor = ws;

  const client = new NeonPool({ connectionString });

  const db = neonDrizzle(client, { schema });

  await migrator.migrate(db, {
    migrationsFolder: join(__dirname, '../migrations'),
  });

  return db;
};
