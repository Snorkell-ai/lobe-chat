import OpenAI, { ClientOptions } from 'openai';
import urlJoin from 'url-join';

import { getLLMConfig } from '@/config/llm';
import { ChatErrorType } from '@/types/fetch';

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
// create Azure OpenAI Instance
export const createAzureOpenai = (params: {
  apiVersion?: string | null;
  endpoint?: string | null;
  model: string;
  userApiKey?: string | null;
}) => {
  const { OPENAI_PROXY_URL = '', AZURE_API_VERSION, AZURE_API_KEY } = getLLMConfig();

  const endpoint = !params.endpoint ? OPENAI_PROXY_URL : params.endpoint;
  const baseURL = urlJoin(endpoint, `/openai/deployments/${params.model.replace('.', '')}`); // refs: https://test-001.openai.azure.com/openai/deployments/gpt-35-turbo

  const defaultApiVersion = AZURE_API_VERSION || '2023-08-01-preview';
  const apiVersion = !params.apiVersion ? defaultApiVersion : params.apiVersion;
  const apiKey = !params.userApiKey ? AZURE_API_KEY : params.userApiKey;

  if (!apiKey) throw new Error('AZURE_API_KEY is empty', { cause: ChatErrorType.NoOpenAIAPIKey });

  const config: ClientOptions = {
    apiKey,
    baseURL,
    defaultHeaders: { 'api-key': apiKey },
    defaultQuery: { 'api-version': apiVersion },
  };

  return new OpenAI(config);
};
