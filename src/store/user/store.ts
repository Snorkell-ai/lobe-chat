import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type UserState, initialState } from './initialState';
import { type UserAuthAction, createAuthSlice } from './slices/auth/action';
import { type CommonAction, createCommonSlice } from './slices/common/action';
import { type ModelListAction, createModelListSlice } from './slices/modelList/action';
import { type PreferenceAction, createPreferenceSlice } from './slices/preference/action';
import { type UserSettingsAction, createSettingsSlice } from './slices/settings/action';
import { type SyncAction, createSyncSlice } from './slices/sync/action';

//  ===============  聚合 createStoreFn ============ //

export type UserStore = SyncAction &
  UserState &
  UserSettingsAction &
  PreferenceAction &
  ModelListAction &
  UserAuthAction &
  CommonAction;

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
const createStore: StateCreator<UserStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createSyncSlice(...parameters),
  ...createSettingsSlice(...parameters),
  ...createPreferenceSlice(...parameters),
  ...createAuthSlice(...parameters),
  ...createCommonSlice(...parameters),
  ...createModelListSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('user');

export const useUserStore = createWithEqualityFn<UserStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
