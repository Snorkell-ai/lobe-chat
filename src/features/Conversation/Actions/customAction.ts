import { ActionIconGroupItems } from '@lobehub/ui/es/ActionIconGroup';
import { css, cx } from 'antd-style';
import { LanguagesIcon, Play } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { localeOptions } from '@/locales/resources';

const translateStyle = css`
  .ant-dropdown-menu-sub {
    overflow-y: scroll;
    max-height: 400px;
  }
`;

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
export const useCustomActions = () => {
  const { t } = useTranslation('chat');

  const translate = {
    children: localeOptions.map((i) => ({
      key: i.value,
      label: t(`lang.${i.value}`, { ns: 'common' }),
    })),
    icon: LanguagesIcon,
    key: 'translate',
    label: t('translate.action'),
    popupClassName: cx(translateStyle),
  } as ActionIconGroupItems;

  const tts = {
    icon: Play,
    key: 'tts',
    label: t('tts.action'),
  } as ActionIconGroupItems;

  return useMemo(() => ({ translate, tts }), []);
};
