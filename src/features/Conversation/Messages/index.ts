import { useOpenChatSettings } from '@/hooks/useInterceptingRoutes';
import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import { OnAvatarsClick, RenderMessage } from '../types';
import { AssistantMessage } from './Assistant';
import { DefaultMessage } from './Default';
import { ToolMessage } from './Tool';
import { UserMessage } from './User';

export const renderMessages: Record<string, RenderMessage> = {
  assistant: AssistantMessage,
  default: DefaultMessage,
  function: DefaultMessage,
  tool: ToolMessage,
  user: UserMessage,
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
export const useAvatarsClick = (): OnAvatarsClick => {
  const [isInbox] = useSessionStore((s) => [sessionSelectors.isInboxSession(s)]);
  const [toggleSystemRole] = useGlobalStore((s) => [s.toggleSystemRole]);
  const openChatSettings = useOpenChatSettings();

  return (role) => {
    switch (role) {
      case 'assistant': {
        return () => {
          if (!isInbox) {
            toggleSystemRole(true);
          } else {
            openChatSettings();
          }
        };
      }
    }
  };
};
