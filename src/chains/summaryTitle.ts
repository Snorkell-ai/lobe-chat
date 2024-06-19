import { globalHelpers } from '@/store/user/helpers';
import { ChatStreamPayload, OpenAIChatMessage } from '@/types/openai/chat';

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
export const chainSummaryTitle = (messages: OpenAIChatMessage[]): Partial<ChatStreamPayload> => {
  const lang = globalHelpers.getCurrentLanguage();

  return {
    messages: [
      {
        content: '你是一名擅长会话的助理，你需要将用户的会话总结为 10 个字以内的标题',
        role: 'system',
      },
      {
        content: `${messages.map((message) => `${message.role}: ${message.content}`).join('\n')}

请总结上述对话为10个字以内的标题，不需要包含标点符号，输出语言语种为：${lang}`,
        role: 'user',
      },
    ],
  };
};
