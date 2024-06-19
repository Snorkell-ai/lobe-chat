import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { FilesStoreState, initialState } from './initialState';
import { FileAction, createFileSlice } from './slices/images';
import { TTSFileAction, createTTSFileSlice } from './slices/tts';

//  ===============  聚合 createStoreFn ============ //

export type FileStore = FilesStoreState & FileAction & TTSFileAction;

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
const createStore: StateCreator<FileStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createFileSlice(...parameters),
  ...createTTSFileSlice(...parameters),
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('file');

export const useFileStore = createWithEqualityFn<FileStore>()(devtools(createStore), shallow);
