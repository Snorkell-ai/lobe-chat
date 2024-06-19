import { V4Settings, V5Settings } from './type';

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
export const migrateSettingsToUser = (
  settings: V4Settings,
): { avatar: string; settings: V5Settings } => {
  const dbSettings: V5Settings = {
    defaultAgent: settings.defaultAgent,
    fontSize: settings.fontSize,
    language: settings.language,
    languageModel: {
      openai: settings.languageModel.openAI,
    },
    password: settings.password,
    themeMode: settings.themeMode,
    tts: settings.tts,
  };

  return {
    avatar: settings.avatar,
    settings: dbSettings,
  };
};
