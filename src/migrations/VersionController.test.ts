import { Migration, MigrationData, VersionController } from './VersionController';

class TestMigration0 implements Migration {
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
class TestMigration1 implements Migration {
  version = 1;

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
    return {
      state: {
        ...data.state,
        value1: data.state.value * 2,
      },
      version: this.version,
    };
  }
}

class TestMigration2 implements Migration {
  version = 2;

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
    return {
      state: {
        ...data.state,
        value2: data.state.value1 * 2,
      },
      version: this.version,
    };
  }
}

describe('VersionController', () => {
  let migrations;
  let versionController: VersionController<any>;

  beforeEach(() => {
    migrations = [TestMigration0, TestMigration1, TestMigration2];
    versionController = new VersionController(migrations);
  });

  it('should instantiate with sorted migrations', () => {
    expect(versionController['migrations'][0].version).toBe(0);
    expect(versionController['migrations'][1].version).toBe(1);
    expect(versionController['migrations'][2].version).toBe(2);
  });

  it('should throw error if data version is undefined', () => {
    const data = {
      state: { value: 10 },
    };

    expect(() => versionController.migrate(data as any)).toThrow();
  });

  it('should migrate data correctly through multiple versions', () => {
    const data: MigrationData = {
      state: { value: 10 },
      version: 0,
    };

    const migratedData = versionController.migrate(data);

    expect(migratedData).toEqual({
      state: { value: 10, value1: 20, value2: 40 },
      version: 3,
    });
  });

  it('should migrate data correctly if starting from a specific version', () => {
    const data: MigrationData = {
      state: { value: 10, value1: 20 },
      version: 1,
    };

    const migratedData = versionController.migrate(data);

    expect(migratedData).toEqual({
      state: { value: 10, value1: 20, value2: 40 },
      version: 3,
    });
  });
});
