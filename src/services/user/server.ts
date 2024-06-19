import { DeepPartial } from 'utility-types';

import { lambdaClient } from '@/libs/trpc/client';
import { IUserService } from '@/services/user/type';
import { UserInitializationState, UserPreference } from '@/types/user';
import { UserSettings } from '@/types/user/settings';

export class ServerService implements IUserService {
  getUserState = async (): Promise<UserInitializationState> => {
    return lambdaClient.user.getUserState.query();
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
  async makeUserOnboarded() {
    return lambdaClient.user.makeUserOnboarded.mutate();
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
  async updatePreference(preference: UserPreference) {
    return lambdaClient.user.updatePreference.mutate(preference);
  }

  updateUserSettings = async (value: DeepPartial<UserSettings>, signal?: AbortSignal) => {
    return lambdaClient.user.updateSettings.mutate(value, { signal });
  };

  resetUserSettings = async () => {
    return lambdaClient.user.resetSettings.mutate();
  };
}
