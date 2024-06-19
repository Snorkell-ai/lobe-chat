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
export const useOnPluginFetchMessage = (onRequest: (data: any) => void, deps: any[] = []) => {
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
      if (e.data.type === PluginChannel.fetchPluginMessage) {
        onRequest(e.data);
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, deps);
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
export const useOnPluginFetchPluginState = (onRequest: (key: string) => void) => {
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
      if (e.data.type === PluginChannel.fetchPluginState) {
        onRequest(e.data.key);
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
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
export const useOnPluginFillContent = (
  callback: (content: string, triggerAiMessage?: boolean) => void,
) => {
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
      if (e.data.type === PluginChannel.fillStandalonePluginContent) {
        const data = e.data.content;
        const triggerAiMessage = e.data.triggerAiMessage;
        const content = typeof data !== 'string' ? JSON.stringify(data) : data;

        callback(content, triggerAiMessage);
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
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
export const useOnPluginFetchPluginSettings = (onRequest: () => void) => {
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
      if (e.data.type === PluginChannel.fetchPluginSettings) {
        onRequest();
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
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
export const useOnPluginTriggerAIMessage = (callback: (id: string) => void) => {
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
      if (e.data.type === PluginChannel.triggerAIMessage) {
        callback(e.data.id);
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
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
export const useOnPluginCreateAssistantMessage = (callback: (content: string) => void) => {
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
      if (e.data.type === PluginChannel.createAssistantMessage) {
        callback(e.data.content);
      }
    };

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
};
