import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

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
export const validateRequest = async (request: Request, secret: string) => {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-signature': headerPayload.get('svix-signature')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
  };
  const wh = new Webhook(secret);

  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch {
    console.error('incoming webhook failed verification');
    return;
  }
};
