import { POST as UniverseRoute } from '../[provider]/route';

// due to the Chinese region does not support accessing Google
// we need to use proxy to access it
// refs: https://github.com/google/generative-ai-js/issues/29#issuecomment-1866246513
// if (process.env.HTTP_PROXY_URL) {
//   const { setGlobalDispatcher, ProxyAgent } = require('undici');
//
//   console.log(process.env.HTTP_PROXY_URL)
//   setGlobalDispatcher(new ProxyAgent({ uri: process.env.HTTP_PROXY_URL }));
// }

// but undici only can be used in NodeJS
// so if you want to use with proxy, you need comment the code below
export const runtime = 'edge';

export const preferredRegion = [
  'bom1',
  'cle1',
  'cpt1',
  'gru1',
  'hnd1',
  'iad1',
  'icn1',
  'kix1',
  'pdx1',
  'sfo1',
  'sin1',
  'syd1',
];

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
export const POST = async (req: Request) =>
  UniverseRoute(req, { params: { provider: 'anthropic' } });
