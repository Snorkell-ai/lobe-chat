import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { SessionStoreState, initialState } from './initialState';
import { AgentChatAction, createChatSlice } from './slices/chat/action';

//  ===============  aggregate createStoreFn ============ //

export interface AgentStore extends AgentChatAction, SessionStoreState {}

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
const createStore: StateCreator<AgentStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createChatSlice(...parameters),
});

//  ===============  implement useStore ============ //

const devtools = createDevtools('agent');

export const useAgentStore = createWithEqualityFn<AgentStore>()(devtools(createStore), shallow);
