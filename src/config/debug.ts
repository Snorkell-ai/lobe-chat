declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_DEVELOPER_DEBUG: string;
      NEXT_PUBLIC_I18N_DEBUG: string;
      NEXT_PUBLIC_I18N_DEBUG_BROWSER: string;

      NEXT_PUBLIC_I18N_DEBUG_SERVER: string;
    }
  }
}

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
export const getDebugConfig = () => ({
  // developer debug mode
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEVELOPER_DEBUG === '1',

  // i18n debug mode
  I18N_DEBUG: process.env.NEXT_PUBLIC_I18N_DEBUG === '1',
  I18N_DEBUG_BROWSER: process.env.NEXT_PUBLIC_I18N_DEBUG_BROWSER === '1',
  I18N_DEBUG_SERVER: process.env.NEXT_PUBLIC_I18N_DEBUG_SERVER === '1',
});
