import { Ollama } from 'ollama/browser';
import { ClientOptions } from 'openai';

import { OpenAIChatMessage } from '@/libs/agent-runtime';
import { ChatModelCard } from '@/types/llm';

import { LobeRuntimeAI } from '../BaseAI';
import { AgentRuntimeErrorType } from '../error';
import { ChatCompetitionOptions, ChatStreamPayload, ModelProvider } from '../types';
import { AgentRuntimeError } from '../utils/createError';
import { StreamingResponse } from '../utils/response';
import { OllamaStream } from '../utils/streams';
import { parseDataUri } from '../utils/uriParser';
import { OllamaMessage } from './type';

export class LobeOllamaAI implements LobeRuntimeAI {
  private client: Ollama;

  baseURL?: string;

  constructor({ baseURL }: ClientOptions) {
    try {
      if (baseURL) new URL(baseURL);
    } catch {
      throw AgentRuntimeError.createError(AgentRuntimeErrorType.InvalidOllamaArgs);
    }

    this.client = new Ollama(!baseURL ? undefined : { host: baseURL });

    if (baseURL) this.baseURL = baseURL;
  }

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
  async chat(payload: ChatStreamPayload, options?: ChatCompetitionOptions) {
    try {
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
      const abort = () => {
        this.client.abort();
        options?.signal?.removeEventListener('abort', abort);
      };

      options?.signal?.addEventListener('abort', abort);

      const response = await this.client.chat({
        messages: this.buildOllamaMessages(payload.messages),
        model: payload.model,
        options: {
          frequency_penalty: payload.frequency_penalty,
          presence_penalty: payload.presence_penalty,
          temperature: payload.temperature,
          top_p: payload.top_p,
        },
        stream: true,
      });

      return StreamingResponse(OllamaStream(response, options?.callback), {
        headers: options?.headers,
      });
    } catch (error) {
      const e = error as { message: string; name: string; status_code: number };

      throw AgentRuntimeError.chat({
        error: { message: e.message, name: e.name, status_code: e.status_code },
        errorType: AgentRuntimeErrorType.OllamaBizError,
        provider: ModelProvider.Ollama,
      });
    }
  }

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
  async models(): Promise<ChatModelCard[]> {
    const list = await this.client.list();
    return list.models.map((model) => ({
      id: model.name,
    }));
  }

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
  private buildOllamaMessages(messages: OpenAIChatMessage[]) {
    return messages.map((message) => this.convertContentToOllamaMessage(message));
  }

  private convertContentToOllamaMessage = (message: OpenAIChatMessage): OllamaMessage => {
    if (typeof message.content === 'string') {
      return { content: message.content, role: message.role };
    }

    const ollamaMessage: OllamaMessage = {
      content: '',
      role: message.role,
    };

    for (const content of message.content) {
      switch (content.type) {
        case 'text': {
          // keep latest text input
          ollamaMessage.content = content.text;
          break;
        }
        case 'image_url': {
          const { base64 } = parseDataUri(content.image_url.url);
          if (base64) {
            ollamaMessage.images ??= [];
            ollamaMessage.images.push(base64);
          }
          break;
        }
      }
    }

    return ollamaMessage;
  };
}

export default LobeOllamaAI;
