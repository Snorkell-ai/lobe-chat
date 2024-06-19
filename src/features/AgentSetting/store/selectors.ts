import { DEFAULT_AGENT_CHAT_CONFIG } from '@/const/settings';
import { LobeAgentChatConfig } from '@/types/agent';

import { Store } from './action';

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
const chatConfig = (s: Store): LobeAgentChatConfig =>
  s.config.chatConfig || DEFAULT_AGENT_CHAT_CONFIG;

export const selectors = {
  chatConfig,
};
