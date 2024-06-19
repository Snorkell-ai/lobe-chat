import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { isDev } from '@/utils/env';

import { createDevtools } from '../middleware/createDevtools';
import { SessionStoreState, initialState } from './initialState';
import { SessionAction, createSessionSlice } from './slices/session/action';
import { SessionGroupAction, createSessionGroupSlice } from './slices/sessionGroup/action';

//  ===============  聚合 createStoreFn ============ //

export interface SessionStore extends SessionAction, SessionGroupAction, SessionStoreState {}

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
const createStore: StateCreator<SessionStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createSessionSlice(...parameters),
  ...createSessionGroupSlice(...parameters),
});

//  ===============  implement useStore ============ //
const devtools = createDevtools('session');

export const useSessionStore = createWithEqualityFn<SessionStore>()(
  subscribeWithSelector(
    devtools(createStore, {
      name: 'LobeChat_Session' + (isDev ? '_DEV' : ''),
    }),
  ),
  shallow,
);
