import OpenAI from 'openai';

import { TextToImagePayload } from '@/libs/agent-runtime/types/textToImage';
import { ChatModelCard } from '@/types/llm';

import { ChatCompetitionOptions, ChatStreamPayload } from './types';

export interface LobeRuntimeAI {
  baseURL?: string;
  chat(payload: ChatStreamPayload, options?: ChatCompetitionOptions): Promise<Response>;

  models?(): Promise<any>;

  textToImage?: (payload: TextToImagePayload) => Promise<string[]>;
}

export abstract class LobeOpenAICompatibleRuntime {
  abstract baseURL: string;
  abstract client: OpenAI;

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
  abstract chat(payload: ChatStreamPayload, options?: ChatCompetitionOptions): Promise<Response>;

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
  abstract models(): Promise<ChatModelCard[]>;
}
