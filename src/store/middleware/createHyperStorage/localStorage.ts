import { StorageValue } from 'zustand/middleware';

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
export const createLocalStorage = <State extends any>() => ({
  getItem: <T extends State>(name: string): StorageValue<T> | undefined => {
    if (!global.localStorage) return undefined;
    const string = localStorage.getItem(name);

    if (string) return JSON.parse(string) as StorageValue<T>;

    return undefined;
  },
  removeItem: (name: string) => {
    if (global.localStorage) localStorage.removeItem(name);
  },
  setItem: <T extends State>(name: string, state: T, version: number | undefined) => {
    if (global.localStorage) localStorage.setItem(name, JSON.stringify({ state, version }));
  },
});
