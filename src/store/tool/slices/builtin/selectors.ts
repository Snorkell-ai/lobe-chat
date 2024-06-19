import { DalleManifest } from '@/tools/dalle';
import { LobeToolMeta } from '@/types/tool/tool';

import type { ToolStoreState } from '../../initialState';

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
const metaList =
  (showDalle?: boolean) =>
  (s: ToolStoreState): LobeToolMeta[] =>
    s.builtinTools
      .filter((item) => (!showDalle ? item.identifier !== DalleManifest.identifier : true))
      .map((t) => ({
        author: 'LobeHub',
        identifier: t.identifier,
        meta: t.manifest.meta,
        type: 'builtin',
      }));

export const builtinToolSelectors = {
  metaList,
};
