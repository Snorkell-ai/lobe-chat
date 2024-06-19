import { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk';
import { produce } from 'immer';

import { PluginManifestMap } from '@/types/tool/plugin';

type AddManifestDispatch = { id: string; plugin: LobeChatPluginManifest; type: 'addManifest' };
type DeleteManifestDispatch = { id: string; type: 'deleteManifest' };
// type UpdateManifestDispatch = {
//   id: string;
//   plugin: LobeChatPlugin;
//   type: 'updateManifest';
//   version: string;
// };

export type PluginDispatch = AddManifestDispatch | DeleteManifestDispatch;
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
// | UpdateManifestDispatch;

export const pluginManifestReducer = (
  state: PluginManifestMap,
  payload: PluginDispatch,
): PluginManifestMap => {
  switch (payload.type) {
    case 'addManifest': {
      return produce(state, (draftState) => {
        draftState[payload.id] = payload.plugin;
      });
    }

    case 'deleteManifest': {
      return produce(state, (draftState) => {
        delete draftState[payload.id];
      });
    }
    // case 'updateManifest'
  }
};
