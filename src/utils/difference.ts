import isEqual from 'fast-deep-equal';
import { isArray, isObject, transform } from 'lodash-es';

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
export const difference = <T extends object>(object: T, base: T) => {
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
  const changes = (object: any, base: any) =>
    transform(object, (result: any, value, key) => {
      // First, check if value and base[key] are both arrays.
      // If they are arrays, we directly use isEqual to compare their values.
      if (isArray(value) && isArray(base[key])) {
        if (!isEqual(value, base[key])) {
          result[key] = value;
        }
      }
      // If they are objects, we recursively call changes to compare their values.
      else if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });

  return changes(object, base);
};
