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
export const chainLangDetect = (content: string): Partial<ChatStreamPayload> => ({
  messages: [
    {
      content:
        '你是一名精通全世界语言的语言专家，你需要识别用户输入的内容，以国际标准 locale 进行输出',
      role: 'system',
    },
    {
      content: '{你好}',
      role: 'user',
    },
    {
      content: 'zh-CN',
      role: 'assistant',
    },
    {
      content: '{hello}',
      role: 'user',
    },
    {
      content: 'en-US',
      role: 'assistant',
    },
    {
      content: `{${content}}`,
      role: 'user',
    },
  ],
});
