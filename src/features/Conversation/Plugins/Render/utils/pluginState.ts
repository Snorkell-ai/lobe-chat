import { PluginChannel } from '@lobehub/chat-plugin-sdk/client';
import { useEffect } from 'react';

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
export const useOnPluginStateUpdate = (callback: (key: string, value: any) => void) => {
  useEffect(() => {
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
    const fn = (e: MessageEvent) => {
      if (e.data.type === PluginChannel.updatePluginState) {
        const key = e.data.key;
        const value = e.data.value;

        callback(key, value);
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
};
