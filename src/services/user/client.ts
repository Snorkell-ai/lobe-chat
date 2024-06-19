import { DeepPartial } from 'utility-types';

import { MessageModel } from '@/database/client/models/message';
import { SessionModel } from '@/database/client/models/session';
import { UserModel } from '@/database/client/models/user';
import { UserInitializationState, UserPreference } from '@/types/user';
import { UserSettings } from '@/types/user/settings';
import { AsyncLocalStorage } from '@/utils/localStorage';

import { IUserService } from './type';

export class ClientService implements IUserService {
  private preferenceStorage: AsyncLocalStorage<UserPreference>;

  constructor() {
    this.preferenceStorage = new AsyncLocalStorage('LOBE_PREFERENCE');
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
  async getUserState(): Promise<UserInitializationState> {
    const user = await UserModel.getUser();
    const messageCount = await MessageModel.count();
    const sessionCount = await SessionModel.count();

    return {
      avatar: user.avatar,
      canEnablePWAGuide: messageCount >= 2,
      canEnableTrace: messageCount >= 4,
      hasConversation: messageCount > 0 || sessionCount > 0,
      isOnboard: true,
      preference: await this.preferenceStorage.getFromLocalStorage(),
      settings: user.settings as UserSettings,
      userId: user.uuid,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUserSettings = async (patch: DeepPartial<UserSettings>, _?: any) => {
    return UserModel.updateSettings(patch);
  };

  resetUserSettings = async () => {
    return UserModel.resetSettings();
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
  updateAvatar(avatar: string) {
    return UserModel.updateAvatar(avatar);
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
    await this.preferenceStorage.saveToLocalStorage(preference);
  }
}
