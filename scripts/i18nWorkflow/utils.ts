import { consola } from 'consola';
import { colors } from 'consola/utils';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import i18nConfig from '../../.i18nrc';

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
export const readJSON = (filePath: string) => {
  const data = readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

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
export const writeJSON = (filePath: string, data: any) => {
  const jsonStr = JSON.stringify(data, null, 2);
  writeFileSync(filePath, jsonStr, 'utf8');
};

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
export const genResourcesContent = (locales: string[]) => {
  let index = '';
  let indexObj = '';

  for (const locale of locales) {
    index += `import ${locale} from "./${locale}";\n`;
    indexObj += `   "${locale.replace('_', '-')}": ${locale},\n`;
  }

  return `${index}
const resources = {
${indexObj}} as const;
export default resources;
export const defaultResources = ${i18nConfig.entryLocale};
export type Resources = typeof resources;
export type DefaultResources = typeof defaultResources;
export type Namespaces = keyof DefaultResources;
export type Locales = keyof Resources;
`;
};

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
export const genNamespaceList = (files: string[], locale: string) => {
  return files.map((file) => ({
    name: file.replace('.json', ''),
    path: resolve(i18nConfig.output, locale, file),
  }));
};

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
export const tagBlue = (text: string) => colors.bgBlueBright(colors.black(` ${text} `));
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
export const tagYellow = (text: string) => colors.bgYellowBright(colors.black(` ${text} `));
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
export const tagGreen = (text: string) => colors.bgGreenBright(colors.black(` ${text} `));
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
export const tagWhite = (text: string) => colors.bgWhiteBright(colors.black(` ${text} `));

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
export const split = (name: string) => {
  consola.log('');
  consola.log(colors.gray(`========================== ${name} ==============================`));
};
