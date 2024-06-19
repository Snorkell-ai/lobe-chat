import { UserStore } from '@/store/user';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { currentLLMSettings, getProviderConfigById } from '../../settings/selectors/settings';
import { keyVaultsConfigSelectors } from './keyVaults';

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
const isProviderEnabled = (provider: GlobalLLMProviderKey) => (s: UserStore) =>
  getProviderConfigById(provider)(s)?.enabled || false;

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
const isProviderFetchOnClient = (provider: GlobalLLMProviderKey | string) => (s: UserStore) => {
  const config = getProviderConfigById(provider)(s);

  // 1. If no baseUrl and apikey input, force on Server.
  const isProviderEndpointNotEmpty =
    keyVaultsConfigSelectors.isProviderEndpointNotEmpty(provider)(s);
  const isProviderApiKeyNotEmpty = keyVaultsConfigSelectors.isProviderApiKeyNotEmpty(provider)(s);
  if (!isProviderEndpointNotEmpty && !isProviderApiKeyNotEmpty) return false;

  // 2. If only contains baseUrl, force on Client
  if (isProviderEndpointNotEmpty && !isProviderApiKeyNotEmpty) return true;

  // 3. Follow the user settings.
  if (typeof config?.fetchOnClient !== 'undefined') return config?.fetchOnClient;

  // 4. On Server, by default.
  return false;
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
const getCustomModelCard =
  ({ id, provider }: { id?: string; provider?: string }) =>
  (s: UserStore) => {
    if (!provider) return;

    const config = getProviderConfigById(provider)(s);

    return config?.customModelCards?.find((m) => m.id === id);
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
const currentEditingCustomModelCard = (s: UserStore) => {
  if (!s.editingCustomCardModel) return;
  const { id, provider } = s.editingCustomCardModel;

  return getCustomModelCard({ id, provider })(s);
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
const isAutoFetchModelsEnabled =
  (provider: GlobalLLMProviderKey) =>
  (s: UserStore): boolean => {
    return getProviderConfigById(provider)(s)?.autoFetchModelLists || false;
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
const openAIConfig = (s: UserStore) => currentLLMSettings(s).openai;
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
const bedrockConfig = (s: UserStore) => currentLLMSettings(s).bedrock;
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
const ollamaConfig = (s: UserStore) => currentLLMSettings(s).ollama;
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
const azureConfig = (s: UserStore) => currentLLMSettings(s).azure;

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
const isAzureEnabled = (s: UserStore) => currentLLMSettings(s).azure.enabled;

export const modelConfigSelectors = {
  azureConfig,
  bedrockConfig,

  currentEditingCustomModelCard,
  getCustomModelCard,

  isAutoFetchModelsEnabled,
  isAzureEnabled,
  isProviderEnabled,
  isProviderFetchOnClient,

  ollamaConfig,
  openAIConfig,
};
