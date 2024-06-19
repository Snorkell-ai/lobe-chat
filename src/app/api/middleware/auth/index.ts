import { AuthObject } from '@clerk/backend/internal';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { createErrorResponse } from '@/app/api/errorResponse';
import { JWTPayload, LOBE_CHAT_AUTH_HEADER, OAUTH_AUTHORIZED, enableClerk } from '@/const/auth';
import { AgentRuntime, AgentRuntimeError, ChatCompletionErrorPayload } from '@/libs/agent-runtime';
import { ChatErrorType } from '@/types/fetch';

import { checkAuthMethod, getJWTPayload } from './utils';

type CreateRuntime = (jwtPayload: JWTPayload) => AgentRuntime;
type RequestOptions = { createRuntime?: CreateRuntime; params: { provider: string } };

export type RequestHandler = (
  req: Request,
  options: RequestOptions & {
    createRuntime?: CreateRuntime;
    jwtPayload: JWTPayload;
  },
) => Promise<Response>;

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
export const checkAuth =
  (handler: RequestHandler) => async (req: Request, options: RequestOptions) => {
    let jwtPayload: JWTPayload;

    try {
      // get Authorization from header
      const authorization = req.headers.get(LOBE_CHAT_AUTH_HEADER);
      const oauthAuthorized = !!req.headers.get(OAUTH_AUTHORIZED);

      if (!authorization) throw AgentRuntimeError.createError(ChatErrorType.Unauthorized);

      // check the Auth With payload and clerk auth
      let clerkAuth = {} as AuthObject;

      if (enableClerk) {
        clerkAuth = getAuth(req as NextRequest);
      }

      jwtPayload = await getJWTPayload(authorization);

      checkAuthMethod({
        accessCode: jwtPayload.accessCode,
        apiKey: jwtPayload.apiKey,
        clerkAuth,
        nextAuthAuthorized: oauthAuthorized,
      });
    } catch (e) {
      const {
        errorType = ChatErrorType.InternalServerError,
        error: errorContent,
        ...res
      } = e as ChatCompletionErrorPayload;

      const error = errorContent || e;

      return createErrorResponse(errorType, { error, ...res, provider: options.params?.provider });
    }

    return handler(req, { ...options, jwtPayload });
  };
