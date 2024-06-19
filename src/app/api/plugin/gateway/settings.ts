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
export const parserPluginSettings = (
  settingsStr?: string,
): Record<string, Record<string, string>> => {
  if (!settingsStr) return {};

  const settings = new Map();

  const array = settingsStr.split(/[,，]/).filter(Boolean);

  for (const item of array) {
    const [id, pluginSettingsStr] = item.split(':');
    if (!id) continue;

    const pluginSettingItems = pluginSettingsStr.split(';');

    const cleanId = id.trim();

    for (const item of pluginSettingItems) {
      const [key, value] = item.split('=');
      if (!key || !value) continue;
      const cleanKey = key.trim();
      const cleanValue = value.trim();

      settings.set(cleanId, { ...settings.get(cleanId), [cleanKey]: cleanValue });
    }
  }

  return Object.fromEntries(settings.entries());
};
