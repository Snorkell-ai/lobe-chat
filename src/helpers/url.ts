import { ChatMessage } from '@lobehub/ui';

import { Compressor } from '@/utils/compass';

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
export const genShareMessagesUrl = (messages: ChatMessage[], systemRole?: string) => {
  const compassedMsg = systemRole
    ? [{ content: systemRole, role: 'system' }, ...messages]
    : messages;

  return `/share?messages=${Compressor.compress(JSON.stringify(compassedMsg))}`;
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
export const genSystemRoleQuery = async (content: string) => {
  const x = { state: { systemRole: content } };
  const systemRole = await Compressor.compressAsync(JSON.stringify(x));
  return `#systemRole=${systemRole}`;
};
