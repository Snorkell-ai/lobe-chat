import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { pino } from '@/libs/logger';
import { createContext } from '@/server/context';
import { lambdaRouter } from '@/server/routers/lambda';

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
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    /**
     * @link https://trpc.io/docs/v11/context
     */
    createContext: () => createContext(req),

    endpoint: '/trpc/lambda',

    onError: ({ error, path, type }) => {
      pino.info(`Error in tRPC handler (lambda) on path: ${path}, type: ${type}`);
      console.error(error);
    },

    req,
    router: lambdaRouter,
  });

export { handler as GET, handler as POST };
