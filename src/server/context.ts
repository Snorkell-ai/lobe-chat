/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { JWTPayload, LOBE_CHAT_AUTH_HEADER, enableClerk } from '@/const/auth';

type ClerkAuth = ReturnType<typeof getAuth>;

export interface AuthContext {
  auth?: ClerkAuth;
  authorizationHeader?: string | null;
  jwtPayload?: JWTPayload | null;
  userId?: string | null;
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
export const createContextInner = async (params?: {
  auth?: ClerkAuth;
  authorizationHeader?: string | null;
  userId?: string | null;
}): Promise<AuthContext> => ({
  auth: params?.auth,
  authorizationHeader: params?.authorizationHeader,
  userId: params?.userId,
});

export type Context = Awaited<ReturnType<typeof createContextInner>>;

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
export const createContext = async (request: NextRequest): Promise<Context> => {
  // for API-response caching see https://trpc.io/docs/v11/caching

  const authorization = request.headers.get(LOBE_CHAT_AUTH_HEADER);

  let userId;
  let auth;

  if (enableClerk) {
    auth = getAuth(request);

    userId = auth.userId;
  }

  return createContextInner({ auth, authorizationHeader: authorization, userId });
};
