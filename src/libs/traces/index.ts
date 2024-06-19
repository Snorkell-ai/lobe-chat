import { Langfuse } from 'langfuse';
import { CreateLangfuseTraceBody } from 'langfuse-core';

import { getLangfuseConfig } from '@/config/langfuse';
import { CURRENT_VERSION } from '@/const/version';
import { TraceEventClient } from '@/libs/traces/event';

/**
 * We use langfuse as the tracing system to trace the request and response
 */
export class TraceClient {
  private _client?: Langfuse;

  constructor() {
    const { ENABLE_LANGFUSE, LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_HOST } =
      getLangfuseConfig();

    if (!ENABLE_LANGFUSE) return;

    // when enabled langfuse, make sure the key are ready in envs
    if (!LANGFUSE_PUBLIC_KEY || !LANGFUSE_SECRET_KEY) {
      console.log('-----');
      console.error(
        "You are enabling langfuse but don't set the `LANGFUSE_PUBLIC_KEY` or `LANGFUSE_SECRET_KEY`. Please check your env",
      );

      throw new TypeError('NO_LANGFUSE_KEY_ERROR');
    }

    this._client = new Langfuse({
      baseUrl: LANGFUSE_HOST,
      publicKey: LANGFUSE_PUBLIC_KEY,
      release: CURRENT_VERSION,
      secretKey: LANGFUSE_SECRET_KEY,
    });
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
  createEvent(traceId: string) {
    const trace = this.createTrace({ id: traceId });
    if (!trace) return;

    return new TraceEventClient(trace);
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
  createTrace(param: CreateLangfuseTraceBody) {
    return this._client?.trace({ ...param });
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
  async shutdownAsync() {
    await this._client?.shutdownAsync();
  }
}
