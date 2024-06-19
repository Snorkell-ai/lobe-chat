import { DEFAULT_MODEL_PROVIDER_LIST } from '@/config/modelProviders';

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
export const useProviderName = (provider: string) => {
  // const { t } = useTranslation('modelProvider');
  const providerCard = DEFAULT_MODEL_PROVIDER_LIST.find((p) => p.id === provider);

  return providerCard?.name || provider;
};
