import urlJoin from 'url-join';

import { fileEnv } from '@/config/file';
import { lambdaClient } from '@/libs/trpc/client';
import { FilePreview, UploadFileParams } from '@/types/files';

import { IFileService } from './type';

interface CreateFileParams extends Omit<UploadFileParams, 'url'> {
  url: string;
}

export class ServerService implements IFileService {
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
  async createFile(params: UploadFileParams) {
    return lambdaClient.file.createFile.mutate(params as CreateFileParams);
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
  async getFile(id: string): Promise<FilePreview> {
    if (!fileEnv.NEXT_PUBLIC_S3_DOMAIN) {
      throw new Error('fileEnv.NEXT_PUBLIC_S3_DOMAIN is not set while enable server upload');
    }

    const item = await lambdaClient.file.findById.query({ id });

    if (!item) {
      throw new Error('file not found');
    }

    return {
      fileType: item.fileType,
      id: item.id,
      name: item.name,
      saveMode: 'url',
      url: urlJoin(fileEnv.NEXT_PUBLIC_S3_DOMAIN!, item.url!),
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
  async removeFile(id: string) {
    await lambdaClient.file.removeFile.mutate({ id });
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
  async removeAllFiles() {
    await lambdaClient.file.removeAllFiles.mutate();
  }
}
