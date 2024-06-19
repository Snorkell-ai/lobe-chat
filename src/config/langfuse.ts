/* eslint-disable sort-keys-fix/sort-keys-fix , typescript-sort-keys/interface */
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
export const getLangfuseConfig = () => {
  return createEnv({
    runtimeEnv: {
      ENABLE_LANGFUSE: process.env.ENABLE_LANGFUSE === '1',
      LANGFUSE_SECRET_KEY: process.env.LANGFUSE_SECRET_KEY || '',
      LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY || '',
      LANGFUSE_HOST: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
    },

    server: {
      ENABLE_LANGFUSE: z.boolean(),
      LANGFUSE_SECRET_KEY: z.string().optional(),
      LANGFUSE_PUBLIC_KEY: z.string().optional(),
      LANGFUSE_HOST: z.string().url(),
    },
  });
};

export const langfuseEnv = getLangfuseConfig();
