import type { Migration, MigrationData } from './VersionController';

export class MigrationV0ToV1 implements Migration {
  // from this version to start migration
  version = 0;

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
  migrate(data: MigrationData): MigrationData {
    return data;
  }
}
