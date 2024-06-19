import { EnhancedGenerateContentResponse } from '@google/generative-ai';
import { describe, expect, it, vi } from 'vitest';

import * as uuidModule from '@/utils/uuid';

import { GoogleGenerativeAIStream } from './google-ai';

describe('GoogleGenerativeAIStream', () => {
  it('should transform Google Generative AI stream to protocol stream', async () => {
    vi.spyOn(uuidModule, 'nanoid').mockReturnValueOnce('1');

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
    const mockGenerateContentResponse = (text: string, functionCalls?: any[]) =>
      ({
        text: () => text,
        functionCall: () => functionCalls?.[0],
        functionCalls: () => functionCalls,
      }) as EnhancedGenerateContentResponse;

    const mockGoogleStream = new ReadableStream({
      start(controller) {
        controller.enqueue(mockGenerateContentResponse('Hello'));

        controller.enqueue(
          mockGenerateContentResponse('', [{ name: 'testFunction', args: { arg1: 'value1' } }]),
        );
        controller.enqueue(mockGenerateContentResponse(' world!'));
        controller.close();
      },
    });

    const onStartMock = vi.fn();
    const onTextMock = vi.fn();
    const onTokenMock = vi.fn();
    const onToolCallMock = vi.fn();
    const onCompletionMock = vi.fn();

    const protocolStream = GoogleGenerativeAIStream(mockGoogleStream, {
      onStart: onStartMock,
      onText: onTextMock,
      onToken: onTokenMock,
      onToolCall: onToolCallMock,
      onCompletion: onCompletionMock,
    });

    const decoder = new TextDecoder();
    const chunks = [];

    // @ts-ignore
    for await (const chunk of protocolStream) {
      chunks.push(decoder.decode(chunk, { stream: true }));
    }

    expect(chunks).toEqual([
      // text
      'id: chat_1\n',
      'event: text\n',
      `data: "Hello"\n\n`,

      // tool call
      'id: chat_1\n',
      'event: tool_calls\n',
      `data: [{"function":{"arguments":"{\\"arg1\\":\\"value1\\"}","name":"testFunction"},"id":"testFunction_0","index":0,"type":"function"}]\n\n`,

      // text
      'id: chat_1\n',
      'event: text\n',
      `data: " world!"\n\n`,
    ]);

    expect(onStartMock).toHaveBeenCalledTimes(1);
    expect(onTextMock).toHaveBeenNthCalledWith(1, '"Hello"');
    expect(onTextMock).toHaveBeenNthCalledWith(2, '" world!"');
    expect(onTokenMock).toHaveBeenCalledTimes(2);
    expect(onToolCallMock).toHaveBeenCalledTimes(1);
    expect(onCompletionMock).toHaveBeenCalledTimes(1);
  });

  it('should handle empty stream', async () => {
    const mockGoogleStream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const protocolStream = GoogleGenerativeAIStream(mockGoogleStream);

    const decoder = new TextDecoder();
    const chunks = [];

    // @ts-ignore
    for await (const chunk of protocolStream) {
      chunks.push(decoder.decode(chunk, { stream: true }));
    }

    expect(chunks).toEqual([]);
  });
});
