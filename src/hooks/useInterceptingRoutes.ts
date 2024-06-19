import { useMemo } from 'react';
import urlJoin from 'url-join';

import { INBOX_SESSION_ID } from '@/const/session';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useQueryRoute } from '@/hooks/useQueryRoute';
import { useGlobalStore } from '@/store/global';
import { ChatSettingsTabs, SettingsTabs, SidebarTabKey } from '@/store/global/initialState';
import { useSessionStore } from '@/store/session';

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
export const useOpenSettings = (tab: SettingsTabs = SettingsTabs.Common) => {
  const activeId = useSessionStore((s) => s.activeId);
  const router = useQueryRoute();
  const mobile = useIsMobile();

  return useMemo(() => {
    if (mobile) {
      return () => router.push(urlJoin('/settings', tab));
    } else {
      // use Intercepting Routes on Desktop
      return () => router.push('/settings/modal', { query: { session: activeId, tab } });
    }
  }, [mobile, tab, activeId, router]);
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
export const useOpenChatSettings = (tab: ChatSettingsTabs = ChatSettingsTabs.Meta) => {
  const activeId = useSessionStore((s) => s.activeId);
  const openSettings = useOpenSettings(SettingsTabs.Agent);
  const router = useQueryRoute();
  const mobile = useIsMobile();

  return useMemo(() => {
    if (activeId === INBOX_SESSION_ID) {
      useGlobalStore.setState({
        sidebarKey: SidebarTabKey.Setting,
      });
      return openSettings;
    }
    if (mobile) {
      return () => router.push('/chat/settings');
    } else {
      // use Intercepting Routes on Desktop
      return () => router.push('/chat/settings/modal', { query: { session: activeId, tab } });
    }
  }, [openSettings, mobile, activeId, router, tab]);
};
