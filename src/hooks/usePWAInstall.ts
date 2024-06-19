import { pwaInstallHandler } from 'pwa-install-handler';
import { useEffect, useState } from 'react';

import { PWA_INSTALL_ID } from '@/const/layoutTokens';
import { isOnServerSide } from '@/utils/env';

import { usePlatform } from './usePlatform';

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
export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = useState(false);
  const { isSupportInstallPWA, isPWA } = usePlatform();

  useEffect(() => {
    if (isOnServerSide) return;
    pwaInstallHandler.addListener(setCanInstall);
    return () => {
      pwaInstallHandler.removeListener(setCanInstall);
    };
  }, []);

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
  const installCheck = () => {
    // 当在 PWA 中时，不显示安装按钮
    if (isPWA) return false;
    // 其他情况下，根据是否可以安装来显示安装按钮 (如已经安装则不显示)
    if (isSupportInstallPWA) return canInstall;
    // 当在不支持 PWA 的环境中时，安装按钮 (此时为安装教程)
    return true;
  };

  return {
    canInstall: installCheck(),
    install: () => {
      const pwa: any = document.querySelector(`#${PWA_INSTALL_ID}`);
      if (!pwa) return;
      pwa.externalPromptEvent = pwaInstallHandler.getEvent();
      pwa?.showDialog(true);
    },
  };
};
