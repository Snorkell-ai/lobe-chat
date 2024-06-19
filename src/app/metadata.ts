import { Metadata } from 'next';

import { appEnv, getAppConfig } from '@/config/app';
import { OFFICIAL_URL } from '@/const/url';
import { translation } from '@/server/translation';

const title = 'LobeChat';

const { SITE_URL = OFFICIAL_URL } = getAppConfig();
const BASE_PATH = appEnv.NEXT_PUBLIC_BASE_PATH;

// if there is a base path, then we don't need the manifest
const noManifest = !!BASE_PATH;

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
export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await translation('metadata');
  return {
    appleWebApp: {
      statusBarStyle: 'black-translucent',
      title,
    },
    description: t('chat.description'),
    icons: {
      apple: '/apple-touch-icon.png?v=1',
      icon: '/favicon.ico?v=1',
      shortcut: '/favicon-32x32.ico?v=1',
    },
    manifest: noManifest ? undefined : '/manifest.json',
    metadataBase: new URL(SITE_URL),
    openGraph: {
      description: t('chat.description'),
      images: [
        {
          alt: t('chat.title'),
          height: 640,
          url: '/og/cover.png?v=1',
          width: 1200,
        },
      ],
      locale: 'en-US',
      siteName: title,
      title: title,
      type: 'website',
      url: OFFICIAL_URL,
    },
    title: {
      default: t('chat.title'),
      template: '%s · LobeChat',
    },
    twitter: {
      card: 'summary_large_image',
      description: t('chat.description'),
      images: ['/og/cover.png?v=1'],
      site: '@lobehub',
      title: t('chat.title'),
    },
  };
};
