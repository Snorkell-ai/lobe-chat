import { LOBE_CHAT_TRACE_HEADER, LOBE_CHAT_TRACE_ID, TracePayload } from '@/const/trace';

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
export const getTracePayload = (req: Request): TracePayload | undefined => {
  const header = req.headers.get(LOBE_CHAT_TRACE_HEADER);
  if (!header) return;

  return JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
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
export const getTraceId = (res: Response) => res.headers.get(LOBE_CHAT_TRACE_ID);

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
const createTracePayload = (data: TracePayload) => {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(JSON.stringify(data));

  return Buffer.from(buffer).toString('base64');
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
export const createTraceHeader = (data: TracePayload) => {
  return { [LOBE_CHAT_TRACE_HEADER]: createTracePayload(data) };
};
