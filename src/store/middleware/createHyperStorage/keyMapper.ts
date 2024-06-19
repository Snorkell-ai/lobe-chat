import { HyperStorageOptionsObj } from './type';

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
export const createKeyMapper = (options: HyperStorageOptionsObj) => {
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
  const mapStateKeyToStorageKey = (
    key: string,
    mode: keyof HyperStorageOptionsObj = 'localStorage',
  ) => {
    const media = options[mode];
    if (media === false) return key;

    const selectors = media?.selectors;
    if (!selectors) return key;

    let storageKey: string | undefined;

    for (const selector of selectors) {
      if (typeof selector === 'string') {
        if (selector === key) storageKey = key;
      } else {
        if (selector[key]) storageKey = selector[key];
      }
    }

    return storageKey;
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
  const getStateKeyFromStorageKey = (
    key: string,
    mode: keyof HyperStorageOptionsObj = 'localStorage',
  ) => {
    const media = options[mode];
    if (media === false) return key;

    const selectors = media?.selectors;
    if (!selectors) return key;

    let stateKey: string | undefined;

    for (const item of selectors) {
      // 对象如果是 字符串，直接返回该 item key
      if (typeof item === 'string') {
        if (item === key) stateKey = key;
      } else {
        for (const [k, v] of Object.entries(item)) {
          if (v === key) stateKey = k;
        }
      }
    }

    return stateKey;
  };

  return {
    getStateKeyFromStorageKey,
    mapStateKeyToStorageKey,
  };
};
