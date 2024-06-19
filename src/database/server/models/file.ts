import { eq } from 'drizzle-orm';
import { and, desc } from 'drizzle-orm/expressions';

import { serverDB } from '@/database/server/core/db';

import { FileItem, NewFile, files } from '../schemas/lobechat';

export class FileModel {
  private readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  create = async (params: Omit<NewFile, 'id' | 'userId'>) => {
    const result = await serverDB
      .insert(files)
      .values({ ...params, userId: this.userId })
      .returning();

    return { id: result[0].id };
  };

  delete = async (id: string) => {
    return serverDB.delete(files).where(and(eq(files.id, id), eq(files.userId, this.userId)));
  };

  clear = async () => {
    return serverDB.delete(files).where(eq(files.userId, this.userId));
  };

  query = async () => {
    return serverDB.query.files.findMany({
      orderBy: [desc(files.updatedAt)],
      where: eq(files.userId, this.userId),
    });
  };

  findById = async (id: string) => {
    return serverDB.query.files.findFirst({
      where: and(eq(files.id, id), eq(files.userId, this.userId)),
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
  async update(id: string, value: Partial<FileItem>) {
    return serverDB
      .update(files)
      .set({ ...value, updatedAt: new Date() })
      .where(and(eq(files.id, id), eq(files.userId, this.userId)));
  }
}
