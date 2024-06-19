import type { StateCreator } from 'zustand/vanilla';

import { userService } from '@/services/user';
import type { UserStore } from '@/store/user';
import { UserGuide, UserPreference } from '@/types/user';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('preference');

export interface PreferenceAction {
  updateGuideState: (guide: Partial<UserGuide>) => Promise<void>;
  updatePreference: (preference: Partial<UserPreference>, action?: any) => Promise<void>;
}

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
export const createPreferenceSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  PreferenceAction
> = (set, get) => ({
  updateGuideState: async (guide) => {
    const { updatePreference } = get();
    const nextGuide = merge(get().preference.guide, guide);
    await updatePreference({ guide: nextGuide });
  },

  updatePreference: async (preference, action) => {
    const nextPreference = merge(get().preference, preference);

    set({ preference: nextPreference }, false, action || n('updatePreference'));

    await userService.updatePreference(nextPreference);
  },
});
