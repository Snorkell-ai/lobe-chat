import { usePathname } from 'next/navigation';

import { useQuery } from '@/hooks/useQuery';
import { SettingsTabs } from '@/store/global/initialState';

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
export const useActiveSettingsKey = () => {
  const pathname = usePathname();
  const { tab } = useQuery();

  const tabs = pathname.split('/').at(-1);

  if (tabs === 'settings') return SettingsTabs.Common;

  if (tabs === 'modal') return tab as SettingsTabs;

  return tabs as SettingsTabs;
};
