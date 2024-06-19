import { DeepPartial } from 'utility-types';

import { BaseModel } from '@/database/client/core';
import { LobeAgentConfig } from '@/types/agent';
import { uuid } from '@/utils/uuid';

import { DB_Settings, DB_User, DB_UserSchema } from '../schemas/user';

class _UserModel extends BaseModel {
  constructor() {
    super('users', DB_UserSchema);
  }
  // **************** Query *************** //

  getUser = async (): Promise<DB_User & { id: number }> => {
    const noUser = !(await this.table.count());

    if (noUser) await this.table.put({ uuid: uuid() });

    const list = (await this.table.toArray()) as (DB_User & { id: number })[];

    return list[0];
  };

  getAgentConfig = async () => {
    const user = await this.getUser();

    return user.settings?.defaultAgent?.config as LobeAgentConfig;
  };
  // **************** Create *************** //

  create = async (user: DB_User) => {
    return this.table.put(user);
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
  // **************** Delete *************** //

  clear() {
    return this.table.clear();
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
  // **************** Update *************** //

  async updateSettings(settings: DeepPartial<DB_Settings>) {
    const user = await this.getUser();

    return this.update(user.id, { settings: settings as any });
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
  async resetSettings() {
    const user = await this.getUser();

    return this.update(user.id, { avatar: undefined, settings: undefined });
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
  async updateAvatar(avatar: string) {
    const user = await this.getUser();

    return this.update(user.id, { avatar });
  }

  // **************** Helper *************** //

  private update = async (id: number, value: DeepPartial<DB_User>) => {
    return this.table.update(id, value);
  };
}

export const UserModel = new _UserModel();
