'use client';

import { createContext } from 'zustand-utils';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { StoreApiWithSelector } from '@/utils/zustand';

import { Store, store } from './action';

export type { State } from './initialState';

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
export const createStore = () => createWithEqualityFn(subscribeWithSelector(store), shallow);

export const { useStore, useStoreApi, Provider } = createContext<StoreApiWithSelector<Store>>();
