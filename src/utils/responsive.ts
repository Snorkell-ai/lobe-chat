import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

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
export const isMobileDevice = () => {
  if (typeof process === 'undefined') {
    throw new Error('[Server method] you are importing a server-only module outside of server');
  }

  const { get } = headers();
  const ua = get('user-agent');

  // console.debug(ua);
  const device = new UAParser(ua || '').getDevice();

  return device.type === 'mobile';
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
export const gerServerDeviceInfo = () => {
  if (typeof process === 'undefined') {
    throw new Error('[Server method] you are importing a server-only module outside of server');
  }

  const { get } = headers();
  const ua = get('user-agent');

  // console.debug(ua);
  const parser = new UAParser(ua || '');

  return {
    browser: parser.getBrowser().name,
    isMobile: isMobileDevice(),
    os: parser.getOS().name,
  };
};
