import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

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
export const getServerDBConfig = () => {
  return createEnv({
    client: {
      NEXT_PUBLIC_ENABLED_SERVER_SERVICE: z.boolean(),
    },
    runtimeEnv: {
      DATABASE_DRIVER: process.env.DATABASE_DRIVER || 'neon',
      DATABASE_TEST_URL: process.env.DATABASE_TEST_URL,
      DATABASE_URL: process.env.DATABASE_URL,

      KEY_VAULTS_SECRET: process.env.KEY_VAULTS_SECRET,

      NEXT_PUBLIC_ENABLED_SERVER_SERVICE: process.env.NEXT_PUBLIC_SERVICE_MODE === 'server',
    },
    server: {
      DATABASE_DRIVER: z.enum(['neon', 'node']),
      DATABASE_TEST_URL: z.string().optional(),
      DATABASE_URL: z.string().optional(),

      KEY_VAULTS_SECRET: z.string().optional(),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
