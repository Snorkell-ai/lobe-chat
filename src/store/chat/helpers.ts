import { LobeAgentChatConfig } from '@/types/agent';
import { ChatMessage } from '@/types/message';
import { OpenAIChatMessage } from '@/types/openai/chat';
import { encodeAsync } from '@/utils/tokenizer';

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
export const getMessagesTokenCount = async (messages: OpenAIChatMessage[]) =>
  encodeAsync(messages.map((m) => m.content).join(''));

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
export const getMessageById = (messages: ChatMessage[], id: string) =>
  messages.find((m) => m.id === id);

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
const getSlicedMessagesWithConfig = (
  messages: ChatMessage[],
  config: LobeAgentChatConfig,
): ChatMessage[] => {
  // if historyCount is not enabled or set to 0, return all messages
  if (!config.enableHistoryCount || !config.historyCount) return messages;

  // if historyCount is negative, return empty array
  if (config.historyCount <= 0) return [];

  // if historyCount is positive, return last N messages
  return messages.slice(-config.historyCount);
};

export const chatHelpers = {
  getMessageById,
  getMessagesTokenCount,
  getSlicedMessagesWithConfig,
};
