import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { ToolStoreState, initialState } from './initialState';
import { BuiltinToolAction, createBuiltinToolSlice } from './slices/builtin';
import { CustomPluginAction, createCustomPluginSlice } from './slices/customPlugin';
import { PluginAction, createPluginSlice } from './slices/plugin';
import { PluginStoreAction, createPluginStoreSlice } from './slices/store';

//  ===============  聚合 createStoreFn ============ //

export type ToolStore = ToolStoreState &
  CustomPluginAction &
  PluginAction &
  PluginStoreAction &
  BuiltinToolAction;

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
const createStore: StateCreator<ToolStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createPluginSlice(...parameters),
  ...createCustomPluginSlice(...parameters),
  ...createPluginStoreSlice(...parameters),
  ...createBuiltinToolSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('tools');

export const useToolStore = createWithEqualityFn<ToolStore>()(devtools(createStore), shallow);
