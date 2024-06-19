import { diffChars } from 'diff';
import { LangfuseTraceClient } from 'langfuse-core';

import { TraceEventType } from '@/const/trace';
import {
  TraceEventBasePayload,
  TraceEventCopyMessage,
  TraceEventDeleteAndRegenerateMessage,
  TraceEventModifyMessage,
  TraceEventRegenerateMessage,
} from '@/types/trace';

/**
 * trace 事件得分
 */
export enum EventScore {
  DeleteAndRegenerate = -1,
  Regenerate = -0.6,
  Modify = -0.3,
  Copy = 0.6,
}

type EventParams<T> = T & TraceEventBasePayload;

export class TraceEventClient {
  private _trace: LangfuseTraceClient;
  constructor(client: LangfuseTraceClient) {
    this._trace = client;
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
  private scoreObservation(params: {
    name: string;
    observationId?: string;
    traceId: string;
    value: number;
  }) {
    const { observationId, traceId, value, name } = params;

    // score the observation if there is an id
    if (observationId) {
      this._trace.client.score({ name, observationId, traceId, value });
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
  copyMessage({ traceId, observationId, content }: EventParams<TraceEventCopyMessage>) {
    const score = EventScore.Copy;
    // create update event
    this._trace?.event({
      input: content,
      metadata: { score },
      name: TraceEventType.CopyMessage,
    });

    // score the observation if there is an id
    this.scoreObservation({
      name: 'copy message',
      observationId,
      traceId,
      value: score,
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
  async deleteAndRegenerateMessage({
    traceId,
    observationId,
    content,
  }: EventParams<TraceEventDeleteAndRegenerateMessage>) {
    const score = EventScore.DeleteAndRegenerate;
    // create update event
    this._trace?.event({
      input: content,
      metadata: { score },
      name: TraceEventType.DeleteAndRegenerateMessage,
    });

    // score the observation if there is an id
    this.scoreObservation({
      name: 'delete and regenerate message',
      observationId,
      traceId,
      value: score,
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
  async regenerateMessage({
    traceId,
    observationId,
    content,
  }: EventParams<TraceEventRegenerateMessage>) {
    const score = EventScore.Regenerate;
    // create update event
    this._trace?.event({
      input: content,
      metadata: { score },
      name: TraceEventType.RegenerateMessage,
    });

    // score the observation if there is an id
    this.scoreObservation({ name: 'regenerate message', observationId, traceId, value: score });
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
  async modifyMessage({
    content: prev,
    nextContent: next,
    observationId,
    traceId,
  }: EventParams<TraceEventModifyMessage>) {
    const score = EventScore.Modify;

    // create update event
    const diffs = diffChars(prev, next);
    this._trace?.event({
      input: prev,
      metadata: { diffs, score },
      name: TraceEventType.ModifyMessage,
      output: next,
    });

    this._trace.update({
      output: next,
      // TODO: add tag when supported
      // tags: [TraceNameMap.UserEvents]
    });

    // score the observation if there is an id
    this.scoreObservation({
      name: 'modify message',
      observationId,
      traceId,
      value: score,
    });
  }
}
