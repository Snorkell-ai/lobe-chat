import { appEnv } from '@/config/app';

export type ErrorType = Error & { digest?: string };

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
export const sentryCaptureException = async (error: Error & { digest?: string }) => {
  if (!appEnv.NEXT_PUBLIC_ENABLE_SENTRY) return;
  const { captureException } = await import('@sentry/nextjs');
  return captureException(error);
};
