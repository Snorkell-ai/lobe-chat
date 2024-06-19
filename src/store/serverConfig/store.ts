import { StoreApi } from 'zustand';
import { createContext } from 'zustand-utils';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { DEFAULT_FEATURE_FLAGS, IFeatureFlags } from '@/config/featureFlags';
import { createDevtools } from '@/store/middleware/createDevtools';
import { GlobalServerConfig } from '@/types/serverConfig';
import { merge } from '@/utils/merge';
import { StoreApiWithSelector } from '@/utils/zustand';

const initialState: ServerConfigStore = {
  featureFlags: DEFAULT_FEATURE_FLAGS,
  serverConfig: { telemetry: {} },
};

//  ===============  聚合 createStoreFn ============ //

export interface ServerConfigStore {
  featureFlags: IFeatureFlags;
  isMobile?: boolean;
  serverConfig: GlobalServerConfig;
}

type CreateStore = (
  initState: Partial<ServerConfigStore>,
) => StateCreator<ServerConfigStore, [['zustand/devtools', never]]>;

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
const createStore: CreateStore = (runtimeState) => () => ({
  ...merge(initialState, runtimeState),
});

//  ===============  实装 useStore ============ //

let store: StoreApi<ServerConfigStore>;

declare global {
  interface Window {
    global_serverConfigStore: StoreApi<ServerConfigStore>;
  }
}

const devtools = createDevtools('serverConfig');

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
export const initServerConfigStore = (initState: Partial<ServerConfigStore>) =>
  createWithEqualityFn<ServerConfigStore>()(devtools(createStore(initState || {})), shallow);

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
export const createServerConfigStore = (initState?: Partial<ServerConfigStore>) => {
  // make sure there is only one store
  if (!store) {
    store = createWithEqualityFn<ServerConfigStore>()(
      devtools(createStore(initState || {})),
      shallow,
    );

    if (typeof window !== 'undefined') {
      window.global_serverConfigStore = store;
    }
  }

  return store;
};

export const { useStore: useServerConfigStore, Provider } =
  createContext<StoreApiWithSelector<ServerConfigStore>>();
