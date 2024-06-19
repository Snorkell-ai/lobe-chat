import { StateCreator } from 'zustand/vanilla';

import { enableClerk } from '@/const/auth';

import { UserStore } from '../../store';

export interface UserAuthAction {
  enableAuth: () => boolean;
  /**
   * universal logout method
   */
  logout: () => Promise<void>;
  /**
   * universal login method
   */
  openLogin: () => Promise<void>;
  openUserProfile: () => Promise<void>;
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
export const createAuthSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  UserAuthAction
> = (set, get) => ({
  enableAuth: () => {
    return enableClerk || get()?.enabledNextAuth || false;
  },
  logout: async () => {
    if (enableClerk) {
      get().clerkSignOut?.({ redirectUrl: location.toString() });

      return;
    }

    const enableNextAuth = get().enabledNextAuth;
    if (enableNextAuth) {
      const { signOut } = await import('next-auth/react');
      signOut();
    }
  },
  openLogin: async () => {
    if (enableClerk) {
      get().clerkSignIn?.({ fallbackRedirectUrl: location.toString() });

      return;
    }

    const enableNextAuth = get().enabledNextAuth;
    if (enableNextAuth) {
      const { signIn } = await import('next-auth/react');
      signIn();
    }
  },

  openUserProfile: async () => {
    if (enableClerk) {
      get().clerkOpenUserProfile?.();

      return;
    }
  },
});
