import { LOBE_CHAT_ACCESS_CODE, OPENAI_API_KEY_HEADER_KEY, OPENAI_END_POINT } from '@/const/fetch';
import { useUserStore } from '@/store/user';
import { keyVaultsConfigSelectors } from '@/store/user/selectors';

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
// eslint-disable-next-line no-undef
export const createHeaderWithOpenAI = (header?: HeadersInit): HeadersInit => {
  const openai = keyVaultsConfigSelectors.openAIConfig(useUserStore.getState());

  const apiKey = openai.apiKey || '';
  const endpoint = openai.baseURL || '';

  // eslint-disable-next-line no-undef
  return {
    ...header,
    [LOBE_CHAT_ACCESS_CODE]: keyVaultsConfigSelectors.password(useUserStore.getState()),
    [OPENAI_API_KEY_HEADER_KEY]: apiKey,
    [OPENAI_END_POINT]: endpoint,
  };
};
