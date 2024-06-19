import { produce } from 'immer';

import { DEFAULT_AGENT_META } from '@/const/meta';
import { MetaData } from '@/types/meta';
import { merge } from '@/utils/merge';

export type MetaDataDispatch = { type: 'update'; value: Partial<MetaData> } | { type: 'reset' };

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
export const metaDataReducer = (state: MetaData, payload: MetaDataDispatch): MetaData => {
  switch (payload.type) {
    case 'update': {
      return produce(state, (draftState) => {
        return merge(draftState, payload.value);
      });
    }

    case 'reset': {
      return DEFAULT_AGENT_META;
    }
  }
};
