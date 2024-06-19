import { generate } from 'random-words';

import { createNanoId } from '@/utils/uuid';

const prefixes = {
  agents: 'agt',
  files: 'file',
  messages: 'msg',
  plugins: 'plg',
  sessionGroups: 'sg',
  sessions: 'ssn',
  topics: 'tpc',
  user: 'user',
} as const;

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
export const idGenerator = (namespace: keyof typeof prefixes, size = 12) => {
  const hash = createNanoId(size);
  const prefix = prefixes[namespace];

  if (!prefix) throw new Error(`Invalid namespace: ${namespace}, please check your code.`);

  return `${prefix}_${hash()}`;
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
export const randomSlug = () => (generate(2) as string[]).join('-');

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
export const inboxSessionId = (userId: string) => `ssn_inbox_${userId}`;
