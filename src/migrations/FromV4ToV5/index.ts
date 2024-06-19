import type { Migration, MigrationData } from '@/migrations/VersionController';

import { V4ConfigState, V4Message } from './types/v4';
import { V5ConfigState, V5Message } from './types/v5';

export class MigrationV4ToV5 implements Migration {
  // from this version to start migration
  version = 4;

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
  migrate(data: MigrationData<V4ConfigState>): MigrationData<V5ConfigState> {
    const { messages } = data.state;

    return {
      ...data,
      state: {
        ...data.state,
        messages: MigrationV4ToV5.migrateMessage(messages),
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
  static migrateMessage(messages: V4Message[]): V5Message[] {
    let v5Messages: V5Message[] = [];

    messages.forEach((item) => {
      if (item.role === 'function') {
        const toolCallId = `tool_call_${item.id}`;
        const assistantMessageId = `tool_calls_${item.id}`;
        const assistantMessage: V5Message = {
          ...item,
          content: '',
          // make sure the createdAt is before than tool message
          createdAt: item.createdAt - 10,
          id: assistantMessageId,
          plugin: undefined,
          role: 'assistant',
          tools: [{ ...item.plugin!, id: toolCallId }],
          updatedAt: item.updatedAt - 10,
        };

        const toolMessage: V5Message = {
          ...item,
          parentId: assistantMessageId,
          role: 'tool',
          tool_call_id: toolCallId,
        };
        v5Messages.push(assistantMessage, toolMessage);
      }

      // if not function message, just push it
      else {
        v5Messages.push(item as V5Message);
      }
    });

    return v5Messages;
  }
}
