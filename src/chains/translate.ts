import { ChatStreamPayload } from '@/types/openai/chat';

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
export const chainTranslate = (
  content: string,
  targetLang: string,
): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content: '你是一名擅长翻译的助理，你需要将输入的语言翻译为目标语言',
      role: 'system',
    },
    {
      content: `请将以下内容 ${content}，翻译为 ${targetLang} `,
      role: 'user',
    },
  ],
});
