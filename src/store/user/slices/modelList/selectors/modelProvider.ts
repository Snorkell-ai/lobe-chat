import { uniqBy } from 'lodash-es';

import { filterEnabledModels } from '@/config/modelProviders';
import { ChatModelCard, ModelProviderCard } from '@/types/llm';
import { ServerModelProviderConfig } from '@/types/serverConfig';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { UserStore } from '../../../store';
import { currentSettings, getProviderConfigById } from '../../settings/selectors/settings';

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
const serverProviderModelCards =
  (provider: GlobalLLMProviderKey) =>
  (s: UserStore): ChatModelCard[] | undefined => {
    const config = s.serverLanguageModel?.[provider] as ServerModelProviderConfig | undefined;

    if (!config) return;

    return config.serverModelCards;
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
const remoteProviderModelCards =
  (provider: GlobalLLMProviderKey) =>
  (s: UserStore): ChatModelCard[] | undefined => {
    const cards = currentSettings(s).languageModel?.[provider]?.remoteModelCards as
      | ChatModelCard[]
      | undefined;

    if (!cards) return;

    return cards;
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
const isProviderEnabled = (provider: GlobalLLMProviderKey) => (s: UserStore) =>
  getProviderConfigById(provider)(s)?.enabled || false;

// Default Model Provider List

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
const defaultModelProviderList = (s: UserStore): ModelProviderCard[] => s.defaultModelProviderList;

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
export const getDefaultModeProviderById = (provider: string) => (s: UserStore) =>
  defaultModelProviderList(s).find((s) => s.id === provider);

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
const getDefaultEnabledModelsById = (provider: string) => (s: UserStore) => {
  const modelProvider = getDefaultModeProviderById(provider)(s);

  if (modelProvider) return filterEnabledModels(modelProvider);

  return undefined;
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
const getDefaultModelCardById = (id: string) => (s: UserStore) => {
  const list = defaultModelProviderList(s);

  return list.flatMap((i) => i.chatModels).find((m) => m.id === id);
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
// Model Provider List

const getModelCardsById =
  (provider: string) =>
  (s: UserStore): ChatModelCard[] => {
    const builtinCards = getDefaultModeProviderById(provider)(s)?.chatModels || [];

    const userCards = (getProviderConfigById(provider)(s)?.customModelCards || []).map((model) => ({
      ...model,
      isCustom: true,
    }));

    return uniqBy([...userCards, ...builtinCards], 'id');
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
const getEnableModelsById = (provider: string) => (s: UserStore) => {
  if (!getProviderConfigById(provider)(s)?.enabledModels) return;

  return getProviderConfigById(provider)(s)?.enabledModels?.filter(Boolean);
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
const modelProviderList = (s: UserStore): ModelProviderCard[] => s.modelProviderList;

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
const modelProviderListForModelSelect = (s: UserStore): ModelProviderCard[] =>
  modelProviderList(s)
    .filter((s) => s.enabled)
    .map((provider) => ({
      ...provider,
      chatModels: provider.chatModels.filter((model) => model.enabled),
    }));

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
const getModelCardById = (id: string) => (s: UserStore) => {
  const list = modelProviderList(s);

  return list.flatMap((i) => i.chatModels).find((m) => m.id === id);
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
const isModelEnabledFunctionCall = (id: string) => (s: UserStore) =>
  getModelCardById(id)(s)?.functionCall || false;

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
// vision model white list, these models will change the content from string to array
// refs: https://github.com/lobehub/lobe-chat/issues/790
const isModelEnabledVision = (id: string) => (s: UserStore) =>
  getModelCardById(id)(s)?.vision || id.includes('vision');

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
const isModelEnabledFiles = (id: string) => (s: UserStore) => getModelCardById(id)(s)?.files;

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
const isModelEnabledUpload = (id: string) => (s: UserStore) =>
  isModelEnabledVision(id)(s) || isModelEnabledFiles(id)(s);

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
const isModelHasMaxToken = (id: string) => (s: UserStore) =>
  typeof getModelCardById(id)(s)?.tokens !== 'undefined';

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
const modelMaxToken = (id: string) => (s: UserStore) => getModelCardById(id)(s)?.tokens || 0;

export const modelProviderSelectors = {
  defaultModelProviderList,
  getDefaultEnabledModelsById,
  getDefaultModelCardById,

  getEnableModelsById,
  getModelCardById,

  getModelCardsById,
  isModelEnabledFiles,
  isModelEnabledFunctionCall,
  isModelEnabledUpload,
  isModelEnabledVision,
  isModelHasMaxToken,

  isProviderEnabled,

  modelMaxToken,
  modelProviderList,

  modelProviderListForModelSelect,

  remoteProviderModelCards,
  serverProviderModelCards,
};
