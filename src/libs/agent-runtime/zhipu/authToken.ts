import { SignJWT } from 'jose';

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
export const generateApiToken = async (apiKey?: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('Invalid apiKey');
  }

  const [id, secret] = apiKey.split('.');
  if (!id || !secret) {
    throw new Error('Invalid apiKey');
  }

  const expSeconds = 60 * 60 * 24 * 30;
  const nowSeconds = Math.floor(Date.now() / 1000);
  const exp = nowSeconds + expSeconds;
  const jwtConstructor = new SignJWT({ api_key: id })
    .setProtectedHeader({ alg: 'HS256', sign_type: 'SIGN', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(nowSeconds);

  return jwtConstructor.sign(new TextEncoder().encode(secret));
};
