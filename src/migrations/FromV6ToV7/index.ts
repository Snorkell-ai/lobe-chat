import type { Migration, MigrationData } from '@/migrations/VersionController';

import { V6ConfigState, V6Settings } from './types/v6';
import { V7ConfigState, V7KeyVaults, V7Settings } from './types/v7';

const SENSITIVE_KEYS = [
  'apiKey',
  'endpoint',
  'accessKeyId',
  'secretAccessKey',
  'apiVersion',
  'region',
];

type SensitiveKeys = (typeof SENSITIVE_KEYS)[number];

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
function extractSensitiveInfo<T extends Record<string, any>>(
  obj: T,
  sensitiveKeys: SensitiveKeys[],
  provider: string,
): [T, Record<SensitiveKeys, string>] {
  const keyVaults: Record<SensitiveKeys, string> = {} as any;

  sensitiveKeys.forEach((key) => {
    if (obj[key]) {
      if (key === 'endpoint' && provider !== 'azure') {
        keyVaults['baseURL'] = obj[key];
      } else {
        keyVaults[key] = obj[key];
      }

      delete obj[key];
    }
  });

  return [obj, keyVaults];
}

export class MigrationV6ToV7 implements Migration {
  // from this version to start migration
  version = 6;

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
  migrate(data: MigrationData<V6ConfigState>): MigrationData<V7ConfigState> {
    const { settings } = data.state;

    return {
      ...data,
      state: {
        ...data.state,
        settings: !settings ? undefined : MigrationV6ToV7.migrateSettings(settings),
      },
    };
  }

  static migrateSettings = (settings: V6Settings): V7Settings => {
    const {
      languageModel = {},
      password,
      neutralColor,
      themeMode,
      fontSize,
      primaryColor,
      language,
      ...res
    } = settings;

    const keyVaults = {
      password,
    } as V7KeyVaults;

    Object.entries(languageModel).forEach(([provider, config]) => {
      if (!config) return;

      const [strippedConfig, providerVaults] = extractSensitiveInfo(
        config,
        SENSITIVE_KEYS,
        provider,
      );

      // @ts-ignore
      languageModel[provider] = strippedConfig as any;
      // @ts-ignore
      keyVaults[provider] = providerVaults;
    });

    return {
      ...res,
      general: {
        fontSize,
        language,
        neutralColor,
        primaryColor,
        themeMode,
      },
      keyVaults,
      languageModel,
    };
  };
}

export const MigrationKeyValueSettings = MigrationV6ToV7;
