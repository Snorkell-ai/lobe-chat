import { eq } from 'drizzle-orm';
import { and, desc } from 'drizzle-orm/expressions';

import { serverDB } from '@/database/server';

import { NewSessionGroup, UserItem, sessionGroups } from '../schemas/lobechat';

export class TemplateModel {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  create = async (params: NewSessionGroup) => {
    return serverDB.insert(sessionGroups).values({ ...params, userId: this.userId });
  };

  delete = async (id: string) => {
    return serverDB
      .delete(sessionGroups)
      .where(and(eq(sessionGroups.id, id), eq(sessionGroups.userId, this.userId)));
  };

  query = async () => {
    return serverDB.query.sessionGroups.findMany({
      orderBy: [desc(sessionGroups.updatedAt)],
      where: eq(sessionGroups.userId, this.userId),
    });
  };

  findById = async (id: string) => {
    return serverDB.query.sessionGroups.findFirst({
      where: and(eq(sessionGroups.id, id), eq(sessionGroups.userId, this.userId)),
    });
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
  async update(id: string, value: Partial<UserItem>) {
    return serverDB
      .update(sessionGroups)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(sessionGroups.id, id), eq(sessionGroups.userId, this.userId)));
  }
}
