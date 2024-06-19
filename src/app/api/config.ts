import { getLLMConfig } from '@/config/llm';

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
export const getPreferredRegion = (region: string | string[] = 'auto') => {
  try {
    if (getLLMConfig().OPENAI_FUNCTION_REGIONS.length <= 0) {
      return region;
    }

    return getLLMConfig().OPENAI_FUNCTION_REGIONS;
  } catch (error) {
    console.error('get server config failed, error:', error);
    return region;
  }
};
