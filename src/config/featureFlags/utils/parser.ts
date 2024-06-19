import { FeatureFlagsSchema, IFeatureFlags } from '../schema';

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
export function parseFeatureFlag(flagString?: string): Partial<IFeatureFlags> {
  const flags: Partial<IFeatureFlags> = {};

  if (!flagString) return flags;

  // 将中文逗号替换为英文逗号,并按逗号分割字符串
  const flagArray = flagString.trim().replaceAll('，', ',').split(',');

  for (let flag of flagArray) {
    flag = flag.trim();
    if (flag.startsWith('+') || flag.startsWith('-')) {
      const operation = flag[0];
      const key = flag.slice(1);

      const featureKey = key as keyof IFeatureFlags;

      // 检查 key 是否存在于 FeatureFlagsSchema 中
      if (FeatureFlagsSchema.shape[featureKey]) {
        flags[featureKey] = operation === '+';
      }
    }
  }

  return flags;
}
