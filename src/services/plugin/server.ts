import { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk';

import { lambdaClient } from '@/libs/trpc/client';
import { LobeTool } from '@/types/tool';
import { LobeToolCustomPlugin } from '@/types/tool/plugin';

import { IPluginService, InstallPluginParams } from './type';

export class ServerService implements IPluginService {
  installPlugin = async (plugin: InstallPluginParams) => {
    await lambdaClient.plugin.createOrInstallPlugin.mutate(plugin);
  };

  getInstalledPlugins = (): Promise<LobeTool[]> => {
    return lambdaClient.plugin.getPlugins.query();
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
  async uninstallPlugin(identifier: string) {
    await lambdaClient.plugin.removePlugin.mutate({ id: identifier });
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
  async createCustomPlugin(customPlugin: LobeToolCustomPlugin) {
    await lambdaClient.plugin.createPlugin.mutate({ ...customPlugin, type: 'customPlugin' });
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
  async updatePlugin(id: string, value: LobeToolCustomPlugin) {
    await lambdaClient.plugin.updatePlugin.mutate({
      customParams: value.customParams,
      id,
      manifest: value.manifest,
      settings: value.settings,
    });
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
  async updatePluginManifest(id: string, manifest: LobeChatPluginManifest) {
    await lambdaClient.plugin.updatePlugin.mutate({ id, manifest });
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
  async removeAllPlugins() {
    await lambdaClient.plugin.removeAllPlugins.mutate();
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
  async updatePluginSettings(id: string, settings: any, signal?: AbortSignal) {
    await lambdaClient.plugin.updatePlugin.mutate({ id, settings }, { signal });
  }
}
