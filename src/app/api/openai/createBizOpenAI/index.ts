import OpenAI from 'openai';

import { getOpenAIAuthFromRequest } from '@/const/fetch';
import { ChatErrorType, ErrorType } from '@/types/fetch';

import { createErrorResponse } from '../../errorResponse';
import { checkAuth } from './auth';
import { createOpenai } from './createOpenai';

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
export const createBizOpenAI = (req: Request): Response | OpenAI => {
  const { apiKey, accessCode, endpoint, oauthAuthorized } = getOpenAIAuthFromRequest(req);

  const result = checkAuth({ accessCode, apiKey, oauthAuthorized });

  if (!result.auth) {
    return createErrorResponse(result.error as ErrorType);
  }

  let openai: OpenAI;

  try {
    openai = createOpenai(apiKey, endpoint);
  } catch (error) {
    if ((error as Error).cause === ChatErrorType.NoOpenAIAPIKey) {
      return createErrorResponse(ChatErrorType.NoOpenAIAPIKey);
    }

    console.error(error); // log error to trace it
    return createErrorResponse(ChatErrorType.InternalServerError);
  }

  return openai;
};
