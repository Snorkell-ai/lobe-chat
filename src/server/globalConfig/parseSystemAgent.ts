import { DEFAULT_SYSTEM_AGENT_CONFIG } from '@/const/settings';
import { UserSystemAgentConfig } from '@/types/user/settings';

const protectedKeys = Object.keys(DEFAULT_SYSTEM_AGENT_CONFIG);

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
export const parseSystemAgent = (envString: string = ''): Partial<UserSystemAgentConfig> => {
  if (!envString) return {};

  const config: Partial<UserSystemAgentConfig> = {};

  // 处理全角逗号和多余空格
  let envValue = envString.replaceAll('，', ',').trim();

  const pairs = envValue.split(',');

  for (const pair of pairs) {
    const [key, value] = pair.split('=').map((s) => s.trim());

    if (key && value) {
      const [provider, ...modelParts] = value.split('/');
      const model = modelParts.join('/');

      if (!provider || !model) {
        throw new Error('Missing model or provider value');
      }

      if (protectedKeys.includes(key)) {
        config[key as keyof UserSystemAgentConfig] = {
          model: model.trim(),
          provider: provider.trim(),
        };
      }
    } else {
      throw new Error('Invalid environment variable format');
    }
  }

  return config;
};
