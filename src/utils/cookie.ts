import dayjs from 'dayjs';

import { COOKIE_CACHE_DAYS } from '@/const/settings';

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
export const setCookie = (key: string, value: string | undefined) => {
  const expires = dayjs().add(COOKIE_CACHE_DAYS, 'day').toISOString();

  // eslint-disable-next-line unicorn/no-document-cookie
  document.cookie = `${key}=${value};expires=${expires};path=/;`;
};
