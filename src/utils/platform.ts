import UAParser from 'ua-parser-js';

import { isOnServerSide } from '@/utils/env';

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
export const getParser = () => {
  if (isOnServerSide) return new UAParser('Node');

  let ua = navigator.userAgent;
  return new UAParser(ua);
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
export const getPlatform = () => {
  return getParser().getOS().name;
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
export const getBrowser = () => {
  return getParser().getResult().browser.name;
};

export const browserInfo = {
  browser: getBrowser(),
  isMobile: getParser().getDevice().type === 'mobile',
  os: getParser().getOS().name,
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
export const isMacOS = () => getPlatform() === 'Mac OS';

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
export const isInStandaloneMode = () => {
  if (isOnServerSide) return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as any).standalone === true)
  );
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
export const isSonomaOrLaterSafari = () => {
  if (isOnServerSide) return false;

  // refs: https://github.com/khmyznikov/pwa-install/blob/0904788b9d0e34399846f6cb7dbb5efeabb62c20/src/utils.ts#L24
  const userAgent = navigator.userAgent.toLowerCase();
  if (navigator.maxTouchPoints || !/macintosh/.test(userAgent)) return false;

  // check safari version >= 17
  const version = /version\/(\d{2})\./.exec(userAgent);
  if (!version || !version[1] || !(parseInt(version[1]) >= 17)) return false;

  try {
    // hacky way to detect Sonoma
    const audioCheck = document.createElement('audio').canPlayType('audio/wav; codecs="1"');
    const webGLCheck = new OffscreenCanvas(1, 1).getContext('webgl');
    return Boolean(audioCheck) && Boolean(webGLCheck);
  } catch {
    return false;
  }
};
