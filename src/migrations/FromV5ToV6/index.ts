import type { Migration, MigrationData } from '@/migrations/VersionController';

import { V5ConfigState, V5Session } from './types/v5';
import { V6ConfigState, V6Session } from './types/v6';

export class MigrationV5ToV6 implements Migration {
  // from this version to start migration
  version = 5;

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
  migrate(data: MigrationData<V5ConfigState>): MigrationData<V6ConfigState> {
    const { sessions } = data.state;

    return {
      ...data,
      state: {
        ...data.state,
        sessions: MigrationV5ToV6.migrateSession(sessions),
      },
    };
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
  static migrateChatConfig(config: V5Session['config']): V6Session['config'] {
    const {
      autoCreateTopicThreshold,
      enableAutoCreateTopic,
      compressThreshold,
      enableCompressThreshold,
      enableHistoryCount,
      enableMaxTokens,
      historyCount,
      inputTemplate,
      displayMode,
      ...agentConfig
    } = config;

    return {
      ...agentConfig,
      chatConfig: {
        autoCreateTopicThreshold,
        compressThreshold,
        displayMode,
        enableAutoCreateTopic,
        enableCompressThreshold,
        enableHistoryCount,
        enableMaxTokens,
        historyCount,
        inputTemplate,
      },
    };
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
  static migrateSession(sessions: V5Session[]): V6Session[] {
    return sessions.map(({ config, updateAt, updatedAt, createdAt, createAt, ...res }) => ({
      ...res,
      config: MigrationV5ToV6.migrateChatConfig(config),
      createdAt: createdAt || createAt!,
      updatedAt: updatedAt || updateAt!,
    }));
  }
}

export const MigrationAgentChatConfig = MigrationV5ToV6;
