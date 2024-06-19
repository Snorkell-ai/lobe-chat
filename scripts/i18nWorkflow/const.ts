import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import i18nConfig from '../../.i18nrc';

export const root = resolve(__dirname, '../..');
export const localesDir = resolve(root, i18nConfig.output);
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
export const localeDir = (locale: string) => resolve(localesDir, locale);
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
export const localeDirJsonList = (locale: string) =>
  readdirSync(localeDir(locale)).filter((name) => name.includes('.json'));
export const srcLocalesDir = resolve(root, './src/locales');
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
export const entryLocaleJsonFilepath = (file: string) =>
  resolve(localesDir, i18nConfig.entryLocale, file);
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
export const outputLocaleJsonFilepath = (locale: string, file: string) =>
  resolve(localesDir, locale, file);
export const srcDefaultLocales = resolve(root, srcLocalesDir, 'default');

export { default as i18nConfig } from '../../.i18nrc';
