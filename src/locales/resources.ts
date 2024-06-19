import resources from './default';

export const locales = [
  'ar',
  'bg-BG',
  'de-DE',
  'en-US',
  'es-ES',
  'fr-FR',
  'ja-JP',
  'ko-KR',
  'pt-BR',
  'ru-RU',
  'tr-TR',
  'zh-CN',
  'zh-TW',
  'vi-VN',
] as const;

export type DefaultResources = typeof resources;
export type NS = keyof DefaultResources;
export type Locales = (typeof locales)[number];

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
export const normalizeLocale = (locale?: string): string => {
  if (!locale) return 'en-US';

  if (locale.startsWith('ar')) return 'ar';

  for (const l of locales) {
    if (l.startsWith(locale)) {
      return l;
    }
  }

  return 'en-US';
};

type LocaleOptions = {
  label: string;
  value: Locales;
}[];

export const localeOptions: LocaleOptions = [
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: '繁體中文',
    value: 'zh-TW',
  },
  {
    label: '日本語',
    value: 'ja-JP',
  },
  {
    label: '한국어',
    value: 'ko-KR',
  },
  {
    label: 'Deutsch',
    value: 'de-DE',
  },
  {
    label: 'Español',
    value: 'es-ES',
  },
  {
    label: 'العربية',
    value: 'ar',
  },
  {
    label: 'Français',
    value: 'fr-FR',
  },
  {
    label: 'Português',
    value: 'pt-BR',
  },
  {
    label: 'Русский',
    value: 'ru-RU',
  },
  {
    label: 'Türkçe',
    value: 'tr-TR',
  },
  {
    label: 'Polski',
    value: 'pl-PL',
  },
  {
    label: 'Nederlands',
    value: 'nl-NL',
  },
  {
    label: 'Italiano',
    value: 'it-IT',
  },
  {
    label: 'Tiếng Việt',
    value: 'vi-VN',
  },
  {
    label: 'Български',
    value: 'bg-BG',
  },
] as LocaleOptions;

export const supportLocales: string[] = [...locales, 'en', 'zh'];
