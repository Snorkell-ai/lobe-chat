import { getAppConfig } from '@/config/app';
import { ChatErrorType } from '@/types/fetch';

interface AuthConfig {
  accessCode?: string | null;
  apiKey?: string | null;
  oauthAuthorized?: boolean;
}

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
export const checkAuth = ({ apiKey, accessCode, oauthAuthorized }: AuthConfig) => {
  // If authorized by oauth
  if (oauthAuthorized) {
    return { auth: true };
  }

  const { ACCESS_CODES } = getAppConfig();

  // if apiKey exist
  if (apiKey) {
    return { auth: true };
  }

  // if accessCode doesn't exist
  if (!ACCESS_CODES.length) return { auth: true };

  if (!accessCode || !ACCESS_CODES.includes(accessCode)) {
    return { auth: false, error: ChatErrorType.InvalidAccessCode };
  }

  return { auth: true };
};
