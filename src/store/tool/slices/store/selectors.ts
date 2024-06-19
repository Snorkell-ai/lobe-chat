import { InstallPluginMeta } from '@/types/tool/plugin';

import type { ToolStoreState } from '../../initialState';

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
const onlinePluginStore = (s: ToolStoreState) => {
  const installedPluginIds = new Set(s.installedPlugins.map((i) => i.identifier));
  const list =
    s.listType === 'all'
      ? s.pluginStoreList
      : s.pluginStoreList.filter((p) => installedPluginIds.has(p.identifier));

  return list.map<InstallPluginMeta>((p) => ({
    author: p.author,
    createdAt: p.createdAt,
    homepage: p.homepage,
    identifier: p.identifier,
    meta: p.meta,
    type: 'plugin',
  }));
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
const isPluginInstallLoading = (id: string) => (s: ToolStoreState) => s.pluginInstallLoading[id];

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
const getPluginById = (id: string) => (s: ToolStoreState) => {
  return s.pluginStoreList.find((i) => i.identifier === id);
};

export const pluginStoreSelectors = {
  getPluginById,
  isPluginInstallLoading,
  onlinePluginStore,
};
