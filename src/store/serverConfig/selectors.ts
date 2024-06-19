import { mapFeatureFlagsEnvToState } from '@/config/featureFlags';

import { ServerConfigStore } from './store';

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
export const featureFlagsSelectors = (s: ServerConfigStore) =>
  mapFeatureFlagsEnvToState(s.featureFlags);

export const serverConfigSelectors = {
  enableUploadFileToServer: (s: ServerConfigStore) => s.serverConfig.enableUploadFileToServer,
  enabledAccessCode: (s: ServerConfigStore) => !!s.serverConfig?.enabledAccessCode,
  enabledOAuthSSO: (s: ServerConfigStore) => s.serverConfig.enabledOAuthSSO,
  enabledTelemetryChat: (s: ServerConfigStore) => s.serverConfig.telemetry.langfuse || false,
  isMobile: (s: ServerConfigStore) => s.isMobile || false,
};
