import { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk';
import { uniq } from 'lodash-es';

import { InstallPluginMeta, LobeToolCustomPlugin } from '@/types/tool/plugin';

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
const installedPlugins = (s: ToolStoreState) => s.installedPlugins;

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
const isPluginInstalled = (id: string) => (s: ToolStoreState) =>
  installedPlugins(s).some((i) => i.identifier === id);

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
const getInstalledPluginById = (id: string) => (s: ToolStoreState) =>
  installedPlugins(s).find((p) => p.identifier === id);

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
const getPluginMetaById = (id: string) => (s: ToolStoreState) => {
  // first try to find meta from store
  const storeMeta = s.pluginStoreList.find((i) => i.identifier === id)?.meta;
  if (storeMeta) return storeMeta;

  // then use installed meta
  return getInstalledPluginById(id)(s)?.manifest?.meta;
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
const getCustomPluginById = (id: string) => (s: ToolStoreState) =>
  installedPlugins(s).find((i) => i.identifier === id && i.type === 'customPlugin') as
    | LobeToolCustomPlugin
    | undefined;

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
const getPluginManifestById = (id: string) => (s: ToolStoreState) =>
  getInstalledPluginById(id)(s)?.manifest;

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
const getPluginSettingsById = (id: string) => (s: ToolStoreState) =>
  getInstalledPluginById(id)(s)?.settings || {};

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
const storeAndInstallPluginsIdList = (s: ToolStoreState) =>
  uniq(
    [
      s.installedPlugins.map((i) => i.identifier),
      s.pluginStoreList.map((i) => i.identifier),
    ].flat(),
  );

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
const installedPluginManifestList = (s: ToolStoreState) =>
  installedPlugins(s)
    .map((i) => i.manifest as LobeChatPluginManifest)
    .filter((i) => !!i);

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
const installedPluginMetaList = (s: ToolStoreState) =>
  installedPlugins(s).map<InstallPluginMeta>((p) => ({
    author: p.manifest?.author,
    createdAt: p.manifest?.createdAt || (p.manifest as any)?.createAt,
    homepage: p.manifest?.homepage,
    identifier: p.identifier,
    meta: getPluginMetaById(p.identifier)(s),
    type: p.type,
  }));
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
const installedCustomPluginMetaList = (s: ToolStoreState) =>
  installedPluginMetaList(s).filter((p) => p.type === 'customPlugin');

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
const isPluginHasUI = (id: string) => (s: ToolStoreState) => {
  const plugin = getPluginManifestById(id)(s);

  return !!plugin?.ui;
};

export const pluginSelectors = {
  getCustomPluginById,
  getInstalledPluginById,
  getPluginManifestById,
  getPluginMetaById,
  getPluginSettingsById,
  installedCustomPluginMetaList,
  installedPluginManifestList,
  installedPluginMetaList,
  installedPlugins,
  isPluginHasUI,
  isPluginInstalled,
  storeAndInstallPluginsIdList,
};
