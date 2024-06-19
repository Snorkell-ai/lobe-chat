import { useRef } from 'react';

import {
  getBrowser,
  getPlatform,
  isInStandaloneMode,
  isSonomaOrLaterSafari,
} from '@/utils/platform';

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
export const usePlatform = () => {
  const platform = useRef(getPlatform());
  const browser = useRef(getBrowser());

  const platformInfo = {
    isApple: platform.current && ['Mac OS', 'iOS'].includes(platform.current),
    isChrome: browser.current === 'Chrome',
    isChromium: browser.current && ['Chrome', 'Edge', 'Opera', 'Brave'].includes(browser.current),
    isEdge: browser.current === 'Edge',
    isIOS: platform.current === 'iOS',
    isMacOS: platform.current === 'Mac OS',
    isPWA: isInStandaloneMode(),
    isSafari: browser.current === 'Safari',
    isSonomaOrLaterSafari: isSonomaOrLaterSafari(),
  };

  return {
    ...platformInfo,
    isSupportInstallPWA:
      (platformInfo.isChromium && !platformInfo.isIOS) ||
      (platformInfo.isMacOS && platformInfo.isSonomaOrLaterSafari),
  };
};
