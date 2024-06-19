import dayjs from 'dayjs';
import { domToJpeg, domToPng, domToSvg, domToWebp } from 'modern-screenshot';
import { useCallback, useState } from 'react';

import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session/selectors';

import { ImageType } from './type';

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
export const useScreenshot = (imageType: ImageType) => {
  const [loading, setLoading] = useState(false);
  const title = useSessionStore(sessionMetaSelectors.currentAgentTitle);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      let screenshotFn: any;
      switch (imageType) {
        case ImageType.JPG: {
          screenshotFn = domToJpeg;
          break;
        }
        case ImageType.PNG: {
          screenshotFn = domToPng;
          break;
        }
        case ImageType.SVG: {
          screenshotFn = domToSvg;
          break;
        }
        case ImageType.WEBP: {
          screenshotFn = domToWebp;
          break;
        }
      }

      const dataUrl = await screenshotFn(document.querySelector('#preview') as HTMLDivElement, {
        features: {
          // 不启用移除控制符，否则会导致 safari emoji 报错
          removeControlCharacter: false,
        },
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `LobeChat_${title}_${dayjs().format('YYYY-MM-DD')}.${imageType}`;
      link.href = dataUrl;
      link.click();
      setLoading(false);
    } catch (error) {
      console.error('Failed to download image', error);
      setLoading(false);
    }
  }, [imageType, title]);

  return {
    loading,
    onDownload: handleDownload,
    title,
  };
};
