import { consola } from 'consola';
import { colors } from 'consola/utils';

import { entryLocaleJsonFilepath, i18nConfig, srcDefaultLocales } from './const';
import { tagWhite, writeJSON } from './utils';

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
export const genDefaultLocale = () => {
  consola.info(`Default locale is ${i18nConfig.entryLocale}...`);

  const resources = require(srcDefaultLocales);
  const data = Object.entries(resources.default);
  consola.start(`Generate default locale json, found ${data.length} namespaces...`);

  for (const [ns, value] of data) {
    const filepath = entryLocaleJsonFilepath(`${ns}.json`);
    writeJSON(filepath, value);
    consola.success(tagWhite(ns), colors.gray(filepath));
  }
};
