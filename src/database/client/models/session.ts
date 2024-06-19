import { DeepPartial } from 'utility-types';

import { DEFAULT_AGENT_LOBE_SESSION } from '@/const/session';
import { BaseModel } from '@/database/client/core';
import { DBModel } from '@/database/client/core/types/db';
import { DB_Session, DB_SessionSchema } from '@/database/client/schemas/session';
import { LobeAgentConfig } from '@/types/agent';
import {
  ChatSessionList,
  LobeAgentSession,
  LobeSessions,
  SessionDefaultGroup,
  SessionGroupId,
} from '@/types/session';
import { merge } from '@/utils/merge';
import { uuid } from '@/utils/uuid';

import { MessageModel } from './message';
import { SessionGroupModel } from './sessionGroup';
import { TopicModel } from './topic';

class _SessionModel extends BaseModel {
  constructor() {
    super('sessions', DB_SessionSchema);
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
  // **************** Query *************** //

  async query({
    pageSize = 9999,
    current = 0,
  }: { current?: number; pageSize?: number } = {}): Promise<LobeSessions> {
    const offset = current * pageSize;

    const items: DBModel<DB_Session>[] = await this.table
      .orderBy('updatedAt')
      .reverse()
      .offset(offset)
      .limit(pageSize)
      .toArray();

    return this.mapToAgentSessions(items);
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
  async queryWithGroups(): Promise<ChatSessionList> {
    const sessionGroups = await SessionGroupModel.query();

    const sessions = await this.query();

    return { sessionGroups, sessions };
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
  async querySessionsByGroupId(group: SessionGroupId): Promise<LobeSessions> {
    const items: DBModel<DB_Session>[] = await this.table
      .where('group')
      .equals(group)
      .and((session) => !session.pinned)
      .reverse()
      .sortBy('updatedAt');

    return this.mapToAgentSessions(items);
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
  async queryByGroupIds(groups: string[]) {
    const pools = groups.map(async (id) => {
      return [id, await this.querySessionsByGroupId(id)] as const;
    });
    const groupItems = await Promise.all(pools);

    return Object.fromEntries(groupItems);
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
  async queryByKeyword(keyword: string): Promise<LobeSessions> {
    if (!keyword) return [];

    const startTime = Date.now();
    const keywordLowerCase = keyword.toLowerCase();

    // First, filter sessions by title and description
    const matchingSessionsPromise = this.table
      .filter((session) => {
        return (
          session.meta.title?.toLowerCase().includes(keywordLowerCase) ||
          session.meta.description?.toLowerCase().includes(keywordLowerCase)
        );
      })
      .toArray();

    // Next, find message IDs that contain the keyword in content or translated content
    const matchingMessagesPromise = this.db.messages
      .filter((message) => {
        // check content
        if (message.content.toLowerCase().includes(keywordLowerCase)) return true;

        // check translate content
        if (message.translate && message.translate.content) {
          return message.translate.content.toLowerCase().includes(keywordLowerCase);
        }

        return false;
      })
      .toArray();

    //  match topics
    const matchingTopicsPromise = this.db.topics
      .filter((topic) => {
        return topic.title?.toLowerCase().includes(keywordLowerCase);
      })
      .toArray();

    // Resolve both promises
    const [matchingSessions, matchingMessages, matchingTopics] = await Promise.all([
      matchingSessionsPromise,
      matchingMessagesPromise,
      matchingTopicsPromise,
    ]);

    const sessionIdsFromMessages = matchingMessages.map((message) => message.sessionId);
    const sessionIdsFromTopics = matchingTopics.map((topic) => topic.sessionId);

    // Combine session IDs from both sources
    const combinedSessionIds = new Set([
      ...sessionIdsFromMessages,
      ...sessionIdsFromTopics,
      ...matchingSessions.map((session) => session.id),
    ]);

    // Retrieve unique sessions by IDs
    const items: DBModel<DB_Session>[] = await this.table
      .where('id')
      .anyOf([...combinedSessionIds])
      .toArray();

    console.log(`检索到 ${items.length} 项，耗时 ${Date.now() - startTime}ms`);
    return this.mapToAgentSessions(items);
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
  async getPinnedSessions(): Promise<LobeSessions> {
    const items: DBModel<DB_Session>[] = await this.table
      .where('pinned')
      .equals(1)
      .reverse()
      .sortBy('updatedAt');

    return this.mapToAgentSessions(items);
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
  async findById(id: string): Promise<DBModel<DB_Session>> {
    return this.table.get(id);
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
  async isEmpty() {
    return (await this.table.count()) === 0;
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
  async count() {
    return this.table.count();
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
  // **************** Create *************** //

  async create(type: 'agent' | 'group', defaultValue: Partial<LobeAgentSession>, id = uuid()) {
    const data = merge(DEFAULT_AGENT_LOBE_SESSION, { type, ...defaultValue });
    const dataDB = this.mapToDB_Session(data);
    return this._addWithSync(dataDB, id);
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
  async batchCreate(sessions: LobeAgentSession[]) {
    const DB_Sessions = await Promise.all(
      sessions.map(async (s) => {
        if (s.group && s.group !== SessionDefaultGroup.Default) {
          // Check if the group exists in the SessionGroup table
          const groupExists = await SessionGroupModel.findById(s.group);
          // If the group does not exist, set it to default
          if (!groupExists) {
            s.group = SessionDefaultGroup.Default;
          }
        }
        return this.mapToDB_Session(s);
      }),
    );

    return this._batchAdd<DB_Session>(DB_Sessions, { idGenerator: uuid });
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
  async duplicate(id: string, newTitle?: string) {
    const session = await this.findById(id);
    if (!session) return;

    const newSession = merge(session, { meta: { title: newTitle } });

    return this._addWithSync(newSession, uuid());
  }

  // **************** Delete *************** //

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
  async delete(id: string) {
    return this.db.transaction('rw', [this.table, this.db.topics, this.db.messages], async () => {
      // Delete all topics associated with the session
      await TopicModel.batchDeleteBySessionId(id);

      // Delete all messages associated with the session
      await MessageModel.batchDeleteBySessionId(id);

      // Finally, delete the session itself
      await this._deleteWithSync(id);
    });
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
  async batchDelete(ids: string[]) {
    return this._bulkDeleteWithSync(ids);
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
  async clearTable() {
    return this._clearWithSync();
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

  async update(id: string, data: Partial<DB_Session>) {
    return super._updateWithSync(id, data);
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
  async updateConfig(id: string, data: DeepPartial<LobeAgentConfig>) {
    const session = await this.findById(id);
    if (!session) return;

    const config = merge(session.config, data);

    return this.update(id, { config });
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
  // **************** Helper *************** //

  private mapToDB_Session(session: LobeAgentSession): DBModel<DB_Session> {
    return {
      ...session,
      createdAt: session.createdAt?.valueOf(),
      group: session.group || SessionDefaultGroup.Default,
      pinned: session.pinned ? 1 : 0,
      updatedAt: session.updatedAt?.valueOf(),
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
  private DB_SessionToAgentSession(session: DBModel<DB_Session>) {
    return {
      ...session,
      createdAt: new Date(session.createdAt),
      model: session.config.model,
      pinned: !!session.pinned,
      updatedAt: new Date(session.updatedAt),
    } as LobeAgentSession;
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
  private mapToAgentSessions(session: DBModel<DB_Session>[]) {
    return session.map((item) => this.DB_SessionToAgentSession(item));
  }
}

export const SessionModel = new _SessionModel();
