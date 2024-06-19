import {
  InvokeModelWithResponseStreamResponse,
  ResponseStream,
} from '@aws-sdk/client-bedrock-runtime';
import { readableFromAsyncIterable } from 'ai';

const chatStreamable = async function* (stream: AsyncIterable<ResponseStream>) {
  for await (const response of stream) {
    if (response.chunk) {
      const decoder = new TextDecoder();

      const value = decoder.decode(response.chunk.bytes, { stream: true });
      try {
        const chunk = JSON.parse(value);

        yield chunk;
      } catch (e) {
        console.log('bedrock stream parser error:', e);

        yield value;
      }
    } else {
      yield response;
    }
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
export const createBedrockStream = (res: InvokeModelWithResponseStreamResponse) =>
  readableFromAsyncIterable(chatStreamable(res.body!));
