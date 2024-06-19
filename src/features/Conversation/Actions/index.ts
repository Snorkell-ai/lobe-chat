import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatStore } from '@/store/chat';
import { LLMRoleType } from '@/types/llm';

import { OnActionsClick, RenderAction } from '../types';
import { AssistantActionsBar } from './Assistant';
import { DefaultActionsBar } from './Fallback';
import { ToolActionsBar } from './Tool';
import { UserActionsBar } from './User';

export const renderActions: Record<LLMRoleType, RenderAction> = {
  assistant: AssistantActionsBar,
  system: DefaultActionsBar,
  tool: ToolActionsBar,
  user: UserActionsBar,
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
export const useActionsClick = (): OnActionsClick => {
  const { t } = useTranslation('common');
  const [
    deleteMessage,
    regenerateMessage,
    translateMessage,
    ttsMessage,
    delAndRegenerateMessage,
    copyMessage,
  ] = useChatStore((s) => [
    s.deleteMessage,
    s.regenerateMessage,
    s.translateMessage,
    s.ttsMessage,
    s.delAndRegenerateMessage,
    s.copyMessage,
  ]);
  const { message } = App.useApp();

  return useCallback<OnActionsClick>(async (action, { id, content, error }) => {
    switch (action.key) {
      case 'copy': {
        await copyMessage(id, content);
        message.success(t('copySuccess', { defaultValue: 'Copy Success' }));
        break;
      }

      case 'del': {
        deleteMessage(id);
        break;
      }

      case 'regenerate': {
        regenerateMessage(id);
        // if this message is an error message, we need to delete it
        if (error) deleteMessage(id);
        break;
      }

      case 'delAndRegenerate': {
        delAndRegenerateMessage(id);
        break;
      }

      case 'tts': {
        ttsMessage(id);
        break;
      }
    }

    if (action.keyPath.at(-1) === 'translate') {
      // click the menu item with translate item, the result is:
      // key: 'en-US'
      // keyPath: ['en-US','translate']
      const lang = action.keyPath[0];
      translateMessage(id, lang);
    }
  }, []);
};
