import { readableFromAsyncIterable } from 'ai';
import { ChatResponse } from 'ollama/browser';

import { ChatStreamCallbacks } from '@/libs/agent-runtime';
import { nanoid } from '@/utils/uuid';

import {
  StreamProtocolChunk,
  StreamStack,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
} from './protocol';

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
const transformOllamaStream = (chunk: ChatResponse, stack: StreamStack): StreamProtocolChunk => {
  // maybe need another structure to add support for multiple choices
  if (chunk.done) {
    return { data: 'finished', id: stack.id, type: 'stop' };
  }

  return { data: chunk.message.content, id: stack.id, type: 'text' };
};

const chatStreamable = async function* (stream: AsyncIterable<ChatResponse>) {
  for await (const response of stream) {
    yield response;
  }
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
export const OllamaStream = (
  res: AsyncIterable<ChatResponse>,
  cb?: ChatStreamCallbacks,
): ReadableStream<string> => {
  const streamStack: StreamStack = { id: 'chat_' + nanoid() };

  return readableFromAsyncIterable(chatStreamable(res))
    .pipeThrough(createSSEProtocolTransformer(transformOllamaStream, streamStack))
    .pipeThrough(createCallbacksTransformer(cb));
};
