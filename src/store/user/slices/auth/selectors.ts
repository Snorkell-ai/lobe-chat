import { t } from 'i18next';

import { enableClerk } from '@/const/auth';
import { UserStore } from '@/store/user';
import { LobeUser } from '@/types/user';

const DEFAULT_USERNAME = 'LobeChat';

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
const nickName = (s: UserStore) => {
  if (!s.enableAuth()) return t('userPanel.defaultNickname', { ns: 'common' });

  if (s.isSignedIn) return s.user?.fullName || s.user?.username;

  return t('userPanel.anonymousNickName', { ns: 'common' });
};

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
const username = (s: UserStore) => {
  if (!s.enableAuth()) return DEFAULT_USERNAME;

  if (s.isSignedIn) return s.user?.username;

  return 'anonymous';
};

export const userProfileSelectors = {
  nickName,
  userAvatar: (s: UserStore): string => s.user?.avatar || '',
  userId: (s: UserStore) => s.user?.id,
  userProfile: (s: UserStore): LobeUser | null | undefined => s.user,
  username,
};

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
const isLogin = (s: UserStore) => {
  // 如果没有开启鉴权，说明不需要登录，默认是登录态
  if (!s.enableAuth()) return true;

  return s.isSignedIn;
};

export const authSelectors = {
  isLoaded: (s: UserStore) => s.isLoaded,
  isLogin,
  isLoginWithAuth: (s: UserStore) => s.isSignedIn,
  isLoginWithClerk: (s: UserStore): boolean => (s.isSignedIn && enableClerk) || false,
};
