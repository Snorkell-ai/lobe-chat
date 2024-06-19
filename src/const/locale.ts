import { normalizeLocale, supportLocales } from '@/locales/resources';

export const DEFAULT_LANG = 'en-US';
export const LOBE_LOCALE_COOKIE = 'LOBE_LOCALE';

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
export const isLocaleNotSupport = (locale: string) => {
  return normalizeLocale(locale) === DEFAULT_LANG || !supportLocales.includes(locale);
};
