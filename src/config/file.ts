import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const DEFAULT_S3_FILE_PATH = 'files';

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
export const getFileConfig = () => {
  return createEnv({
    client: {
      NEXT_PUBLIC_S3_DOMAIN: z.string().url().optional(),
      NEXT_PUBLIC_S3_FILE_PATH: z.string().optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_S3_DOMAIN: process.env.NEXT_PUBLIC_S3_DOMAIN,
      NEXT_PUBLIC_S3_FILE_PATH: process.env.NEXT_PUBLIC_S3_FILE_PATH || DEFAULT_S3_FILE_PATH,

      S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
      S3_BUCKET: process.env.S3_BUCKET,
      S3_ENDPOINT: process.env.S3_ENDPOINT,
      S3_REGION: process.env.S3_REGION,
      S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    },
    server: {
      // S3
      S3_ACCESS_KEY_ID: z.string().optional(),
      S3_BUCKET: z.string().optional(),
      S3_ENDPOINT: z.string().url().optional(),

      S3_REGION: z.string().optional(),
      S3_SECRET_ACCESS_KEY: z.string().optional(),
    },
  });
};

export const fileEnv = getFileConfig();
