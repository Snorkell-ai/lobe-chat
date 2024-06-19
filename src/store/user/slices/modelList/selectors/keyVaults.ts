import { UserStore } from '@/store/user';
import {
  AWSBedrockKeyVault,
  AzureOpenAIKeyVault,
  GlobalLLMProviderKey,
  OpenAICompatibleKeyVault,
  UserKeyVaults,
} from '@/types/user/settings';

import { currentSettings } from '../../settings/selectors/settings';

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
export const keyVaultsSettings = (s: UserStore): UserKeyVaults =>
  currentSettings(s).keyVaults || {};

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
const openAIConfig = (s: UserStore) => keyVaultsSettings(s).openai || {};
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
const bedrockConfig = (s: UserStore) => keyVaultsSettings(s).bedrock || {};
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
const ollamaConfig = (s: UserStore) => keyVaultsSettings(s).ollama || {};
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
const azureConfig = (s: UserStore) => keyVaultsSettings(s).azure || {};
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
const getVaultByProvider = (provider: GlobalLLMProviderKey) => (s: UserStore) =>
  (keyVaultsSettings(s)[provider] || {}) as OpenAICompatibleKeyVault &
    AzureOpenAIKeyVault &
    AWSBedrockKeyVault;

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
const isProviderEndpointNotEmpty = (provider: string) => (s: UserStore) => {
  const vault = getVaultByProvider(provider as GlobalLLMProviderKey)(s);
  return !!vault?.baseURL || !!vault?.endpoint;
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
const isProviderApiKeyNotEmpty = (provider: string) => (s: UserStore) => {
  const vault = getVaultByProvider(provider as GlobalLLMProviderKey)(s);
  return !!vault?.apiKey || !!vault?.accessKeyId || !!vault?.secretAccessKey;
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
const password = (s: UserStore) => keyVaultsSettings(s).password || '';

export const keyVaultsConfigSelectors = {
  azureConfig,
  bedrockConfig,
  getVaultByProvider,
  isProviderApiKeyNotEmpty,
  isProviderEndpointNotEmpty,
  ollamaConfig,
  openAIConfig,
  password,
};
