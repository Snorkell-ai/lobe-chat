import { useCallback } from 'react';

import { useQueryRoute } from '@/hooks/useQueryRoute';
import { useServerConfigStore } from '@/store/serverConfig';
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
export const useSwitchSession = () => {
  const switchSession = useSessionStore((s) => s.switchSession);
  const mobile = useServerConfigStore((s) => s.isMobile);
  const router = useQueryRoute();

  return useCallback(
    (id: string) => {
      switchSession(id);

      if (mobile) {
        setTimeout(() => {
          router.push('/chat', {
            query: { session: id, showMobileWorkspace: 'true' },
          });
        }, 50);
      }
    },
    [mobile],
  );
};
