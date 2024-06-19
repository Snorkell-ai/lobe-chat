import { BaseModel } from '@/database/client/core';
import { DBModel } from '@/database/client/core/types/db';
import { MessageModel } from '@/database/client/models/message';
import { DB_Topic, DB_TopicSchema } from '@/database/client/schemas/topic';
import { ChatTopic } from '@/types/topic';
import { nanoid } from '@/utils/uuid';

export interface CreateTopicParams {
  favorite?: boolean;
  messages?: string[];
  sessionId: string;
  title: string;
}

export interface QueryTopicParams {
  current?: number;
  pageSize?: number;
  sessionId: string;
}

class _TopicModel extends BaseModel {
  constructor() {
    super('topics', DB_TopicSchema);
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

  async query({ pageSize = 9999, current = 0, sessionId }: QueryTopicParams): Promise<ChatTopic[]> {
    const offset = current * pageSize;

    // get all topics
    const allTopics = await this.table.where('sessionId').equals(sessionId).toArray();

    // 将所有主题按星标消息优先，时间倒序进行排序
    const sortedTopics = allTopics.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1; // a是星标，b不是，a排前面
      if (!a.favorite && b.favorite) return 1; // b是星标，a不是，b排前面

      // 如果星标状态相同，则按时间倒序排序
      return b.createdAt - a.createdAt;
    });

    // handle pageSize
    const pagedTopics = sortedTopics.slice(offset, offset + pageSize);

    return pagedTopics.map((i) => this.mapToChatTopic(i));
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
  queryAll() {
    return this.table.orderBy('updatedAt').toArray();
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
  async queryByKeyword(keyword: string, sessionId?: string): Promise<ChatTopic[]> {
    if (!keyword) return [];

    console.time('queryTopicsByKeyword');
    const keywordLowerCase = keyword.toLowerCase();

    // Find topics with matching title
    const queryTable = sessionId ? this.table.where('sessionId').equals(sessionId) : this.table;
    const matchingTopicsPromise = queryTable
      .filter((topic) => topic.title.toLowerCase().includes(keywordLowerCase))
      .toArray();

    // Find messages with matching content or translate.content
    const queryMessages = sessionId
      ? this.db.messages.where('sessionId').equals(sessionId)
      : this.db.messages;
    const matchingMessagesPromise = queryMessages
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

    // Resolve both promises
    const [matchingTopics, matchingMessages] = await Promise.all([
      matchingTopicsPromise,
      matchingMessagesPromise,
    ]);

    // Extract topic IDs from messages
    const topicIdsFromMessages = matchingMessages.map((message) => message.topicId);

    // Combine topic IDs from both sources
    const combinedTopicIds = new Set([
      ...topicIdsFromMessages,
      ...matchingTopics.map((topic) => topic.id),
    ]);

    // Retrieve unique topics by IDs
    const uniqueTopics = await this.table
      .where('id')
      .anyOf([...combinedTopicIds])
      .toArray();

    console.timeEnd('queryTopicsByKeyword');
    return uniqueTopics.map((i) => ({ ...i, favorite: !!i.favorite }));
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
  async findBySessionId(sessionId: string) {
    return this.table.where({ sessionId }).toArray();
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
  async findById(id: string): Promise<DBModel<DB_Topic>> {
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

  async create({ title, favorite, sessionId, messages }: CreateTopicParams, id = nanoid()) {
    const topic = await this._addWithSync(
      { favorite: favorite ? 1 : 0, sessionId, title: title },
      id,
    );

    // add topicId to these messages
    if (messages) {
      await MessageModel.batchUpdate(messages, { topicId: topic.id });
    }

    return topic;
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
  async batchCreate(topics: CreateTopicParams[]) {
    return this._batchAdd(topics.map((t) => ({ ...t, favorite: t.favorite ? 1 : 0 })));
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
  async duplicateTopic(topicId: string, newTitle?: string) {
    return this.db.transaction('rw', [this.db.topics, this.db.messages], async () => {
      // Step 1: get DB_Topic
      const topic = await this.findById(topicId);

      if (!topic) {
        throw new Error(`Topic with id ${topicId} not found`);
      }

      // Step 3: 查询与 `topic` 关联的 `messages`
      const originalMessages = await MessageModel.queryByTopicId(topicId);

      const duplicateMessages = await MessageModel.duplicateMessages(originalMessages);

      const { id } = await this.create({
        ...this.mapToChatTopic(topic),
        messages: duplicateMessages.map((m) => m.id),
        sessionId: topic.sessionId!,
        title: newTitle || topic.title,
      });

      return id;
    });
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
    return this.db.transaction('rw', [this.table, this.db.messages], async () => {
      // Delete all messages associated with the topic
      await MessageModel.batchDeleteByTopicId(id);

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
  async batchDeleteBySessionId(sessionId: string): Promise<void> {
    // use sessionId as the filter criteria in the query.
    const query = this.table.where('sessionId').equals(sessionId);

    // Retrieve a collection of message IDs that satisfy the criteria
    const topicIds = await query.primaryKeys();

    // Use the bulkDelete method to delete all selected messages in bulk
    return this._bulkDeleteWithSync(topicIds);
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
  async batchDelete(topicIds: string[]) {
    return this.db.transaction('rw', [this.table, this.db.messages], async () => {
      // Iterate over each topicId and delete related messages, then delete the topic itself
      for (const topicId of topicIds) {
        // Delete all messages associated with the topic
        await this.delete(topicId);
      }
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
  async update(id: string, data: Partial<DB_Topic>) {
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
  async toggleFavorite(id: string, newState?: boolean) {
    const topic = await this.findById(id);
    if (!topic) {
      throw new Error(`Topic with id ${id} not found`);
    }

    // Toggle the 'favorite' status
    const nextState = typeof newState !== 'undefined' ? newState : !topic.favorite;

    await this.update(id, { favorite: nextState ? 1 : 0 });

    return nextState;
  }

  // **************** Helper *************** //

  private mapToChatTopic = (dbTopic: DBModel<DB_Topic>): ChatTopic => ({
    ...dbTopic,
    favorite: !!dbTopic.favorite,
  });
}

export const TopicModel = new _TopicModel();
