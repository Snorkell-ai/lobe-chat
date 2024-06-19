import { Schema, ValidationResult } from '@cfworker/json-schema';
import useSWR, { SWRResponse } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { pluginService } from '@/services/plugin';
import { merge } from '@/utils/merge';

import { ToolStore } from '../../store';
import { pluginStoreSelectors } from '../store/selectors';
import { pluginSelectors } from './selectors';

/**
 * 插件接口
 */
export interface PluginAction {
  checkPluginsIsInstalled: (plugins: string[]) => Promise<void>;
  removeAllPlugins: () => Promise<void>;
  updatePluginSettings: <T>(id: string, settings: Partial<T>) => Promise<void>;
  useCheckPluginsIsInstalled: (plugins: string[]) => SWRResponse;
  validatePluginSettings: (identifier: string) => Promise<ValidationResult | undefined>;
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
export const createPluginSlice: StateCreator<
  ToolStore,
  [['zustand/devtools', never]],
  [],
  PluginAction
> = (set, get) => ({
  checkPluginsIsInstalled: async (plugins) => {
    // if there is no plugins, just skip.
    if (plugins.length === 0) return;

    const { loadPluginStore, installPlugins } = get();

    // check if the store is empty
    // if it is, we need to load the plugin store
    if (pluginStoreSelectors.onlinePluginStore(get()).length === 0) {
      await loadPluginStore();
    }

    await installPlugins(plugins);
  },
  removeAllPlugins: async () => {
    await pluginService.removeAllPlugins();
    await get().refreshPlugins();
  },
  updatePluginSettings: async (id, settings) => {
    const signal = get().updatePluginSettingsSignal;
    if (signal) signal.abort('canceled');

    const newSignal = new AbortController();

    const previousSettings = pluginSelectors.getPluginSettingsById(id)(get());
    const nextSettings = merge(previousSettings, settings);

    set({ updatePluginSettingsSignal: newSignal }, false, 'create new Signal');
    await pluginService.updatePluginSettings(id, nextSettings, newSignal.signal);

    await get().refreshPlugins();
  },
  useCheckPluginsIsInstalled: (plugins) => useSWR(plugins, get().checkPluginsIsInstalled),
  validatePluginSettings: async (identifier) => {
    const manifest = pluginSelectors.getPluginManifestById(identifier)(get());
    if (!manifest || !manifest.settings) return;
    const settings = pluginSelectors.getPluginSettingsById(identifier)(get());

    // validate the settings
    const { Validator } = await import('@cfworker/json-schema');
    const validator = new Validator(manifest.settings as Schema);
    const result = validator.validate(settings);

    if (!result.valid) return { errors: result.errors, valid: false };

    return { errors: [], valid: true };
  },
});
