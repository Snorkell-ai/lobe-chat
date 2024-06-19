import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type GlobalStoreAction, globalActionSlice } from './action';
import { type GlobalState, initialState } from './initialState';

//  ===============  聚合 createStoreFn ============ //

export type GlobalStore = GlobalState & GlobalStoreAction;

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
const createStore: StateCreator<GlobalStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...globalActionSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('global');

export const useGlobalStore = createWithEqualityFn<GlobalStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
