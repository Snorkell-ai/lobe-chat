import { act } from 'react-dom/test-utils';
import { beforeEach } from 'vitest';
import { createWithEqualityFn as actualCreate } from 'zustand/traditional';

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

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
// when creating a store, we get its initial state, create a reset function and add it in the set
const createImpl = (createState: any) => {
  const store = actualCreate(createState, Object.is);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

// Reset all stores after each test run
beforeEach(() => {
  act(() => {
    for (const resetFn of storeResetFns) {
      resetFn();
    }
  });
});

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
export const createWithEqualityFn = (f: any) => (f === undefined ? createImpl : createImpl(f));
