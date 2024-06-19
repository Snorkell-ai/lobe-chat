import { createStore, delMany, getMany, setMany } from 'idb-keyval';
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
export const createIndexedDB = <State extends any>(dbName: string = 'indexedDB') => ({
  getItem: async <T extends State>(name: string): Promise<StorageValue<T> | undefined> => {
    const [version, state] = await getMany(['version', 'state'], createStore(dbName, name));

    if (!state) return undefined;

    return { state, version };
  },
  removeItem: async (name: string) => {
    await delMany(['version', 'state'], createStore(dbName, name));
  },
  setItem: async (name: string, state: any, version: number | undefined) => {
    const store = createStore(dbName, name);

    await setMany(
      [
        ['version', version],
        ['state', state],
      ],
      store,
    );
  },
});
