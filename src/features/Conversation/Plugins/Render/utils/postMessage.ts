import { PluginChannel } from '@lobehub/chat-plugin-sdk/client';

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
export const sendMessageContentToPlugin = (window: Window, props: any) => {
  window.postMessage({ props, type: PluginChannel.renderPlugin }, '*');
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
export const sendPayloadToPlugin = (
  window: Window,
  props: { payload: any; settings: any; state?: any },
) => {
  window.postMessage(
    {
      type: PluginChannel.initStandalonePlugin,
      ...props,
      // TODO: props need to deprecated
      props: props.payload,
    },
    '*',
  );
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
export const sendPluginStateToPlugin = (window: Window, key: string, value: any) => {
  window.postMessage({ key, type: PluginChannel.renderPluginState, value }, '*');
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
export const sendPluginSettingsToPlugin = (window: Window, settings: any) => {
  window.postMessage({ type: PluginChannel.renderPluginSettings, value: settings }, '*');
};
