import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { authEnv } from '@/config/auth';
import { auth } from '@/libs/next-auth';

import { OAUTH_AUTHORIZED } from './const/auth';

export const config = {
  matcher: [
    // include any files in the api or trpc folders that might have an extension
    '/(api|trpc)(.*)',
    // include the /
    '/',
    '/chat(.*)',
    '/settings(.*)',
    // ↓ cloud ↓
  ],
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
const defaultMiddleware = () => NextResponse.next();

const nextAuthMiddleware = auth((req) => {
  // skip the '/' route
  if (req.nextUrl.pathname === '/') return NextResponse.next();

  // Just check if session exists
  const session = req.auth;

  // Check if next-auth throws errors
  // refs: https://github.com/lobehub/lobe-chat/pull/1323
  const isLoggedIn = !!session?.expires;

  // Remove & amend OAuth authorized header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete(OAUTH_AUTHORIZED);
  if (isLoggedIn) requestHeaders.set(OAUTH_AUTHORIZED, 'true');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

const isProtectedRoute = createRouteMatcher([
  '/settings(.*)',
  // ↓ cloud ↓
]);

export default authEnv.NEXT_PUBLIC_ENABLE_CLERK_AUTH
  ? clerkMiddleware(
      (auth, req) => {
        if (isProtectedRoute(req)) auth().protect();
      },
      { signInUrl: '/login', signUpUrl: '/signup' },
    )
  : authEnv.NEXT_PUBLIC_ENABLE_NEXT_AUTH
    ? nextAuthMiddleware
    : defaultMiddleware;
