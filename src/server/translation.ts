'use server';

import { get } from 'lodash-es';
import { cookies } from 'next/headers';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_LANG, LOBE_LOCALE_COOKIE } from '@/const/locale';
import { NS, normalizeLocale } from '@/locales/resources';
import { isDev } from '@/utils/env';

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
export const translation = async (ns: NS = 'common') => {
  let i18ns = {};
  try {
    const cookieStore = cookies();
    const defaultLang = cookieStore.get(LOBE_LOCALE_COOKIE);
    const lng = defaultLang?.value || DEFAULT_LANG;
    let filepath = join(process.cwd(), `locales/${normalizeLocale(lng)}/${ns}.json`);
    const isExist = existsSync(filepath);
    if (!isExist)
      filepath = join(
        process.cwd(),
        `locales/${normalizeLocale(isDev ? 'zh-CN' : DEFAULT_LANG)}/${ns}.json`,
      );
    const file = readFileSync(filepath, 'utf8');
    i18ns = JSON.parse(file);
  } catch (e) {
    console.error('Error while reading translation file', e);
  }

  return {
    t: (key: string, options: { [key: string]: string } = {}) => {
      if (!i18ns) return key;
      let content = get(i18ns, key);
      if (!content) return key;
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          content = content.replace(`{{${key}}}`, value);
        });
      }
      return content;
    },
  };
};
