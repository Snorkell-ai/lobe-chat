import { produce } from 'immer';
import { StateCreator } from 'zustand/vanilla';

import { chainLangDetect } from '@/chains/langDetect';
import { chainTranslate } from '@/chains/translate';
import { TraceNameMap, TracePayload } from '@/const/trace';
import { supportLocales } from '@/locales/resources';
import { chatService } from '@/services/chat';
import { messageService } from '@/services/message';
import { chatSelectors } from '@/store/chat/selectors';
import { ChatStore } from '@/store/chat/store';
import { useUserStore } from '@/store/user';
import { systemAgentSelectors } from '@/store/user/selectors';
import { ChatTTS, ChatTranslate } from '@/types/message';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('enhance');

/**
 * enhance chat action like translate,tts
 */
export interface ChatEnhanceAction {
  clearTTS: (id: string) => Promise<void>;
  clearTranslate: (id: string) => Promise<void>;
  getCurrentTracePayload: (data: Partial<TracePayload>) => TracePayload;
  translateMessage: (id: string, targetLang: string) => Promise<void>;
  ttsMessage: (
    id: string,
    state?: { contentMd5?: string; file?: string; voice?: string },
  ) => Promise<void>;
  updateMessageTTS: (id: string, data: Partial<ChatTTS> | false) => Promise<void>;
  updateMessageTranslate: (id: string, data: Partial<ChatTranslate> | false) => Promise<void>;
}

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
export const chatEnhance: StateCreator<
  ChatStore,
  [['zustand/devtools', never]],
  [],
  ChatEnhanceAction
> = (set, get) => ({
  clearTTS: async (id) => {
    await get().updateMessageTTS(id, false);
  },

  clearTranslate: async (id) => {
    await get().updateMessageTranslate(id, false);
  },
  getCurrentTracePayload: (data) => ({
    sessionId: get().activeId,
    topicId: get().activeTopicId,
    ...data,
  }),

  translateMessage: async (id, targetLang) => {
    const { internal_toggleChatLoading, updateMessageTranslate, internal_dispatchMessage } = get();

    const message = chatSelectors.getMessageById(id)(get());
    if (!message) return;

    // Get current agent for translation
    const translationSetting = systemAgentSelectors.translation(useUserStore.getState());

    // create translate extra
    await updateMessageTranslate(id, { content: '', from: '', to: targetLang });

    internal_toggleChatLoading(true, id, n('translateMessage(start)', { id }) as string);

    let content = '';
    let from = '';

    // detect from language
    chatService.fetchPresetTaskResult({
      onFinish: async (data) => {
        if (data && supportLocales.includes(data)) from = data;

        await updateMessageTranslate(id, { content, from, to: targetLang });
      },
      params: merge(translationSetting, chainLangDetect(message.content)),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.LanguageDetect }),
    });

    // translate to target language
    await chatService.fetchPresetTaskResult({
      onFinish: async (content) => {
        await updateMessageTranslate(id, { content, from, to: targetLang });
        internal_toggleChatLoading(false, id);
      },
      onMessageHandle: (chunk) => {
        switch (chunk.type) {
          case 'text': {
            internal_dispatchMessage({
              id,
              key: 'translate',
              type: 'updateMessageExtra',
              value: produce({ content: '', from, to: targetLang }, (draft) => {
                content += chunk.text;
                draft.content += content;
              }),
            });
            break;
          }
        }
      },
      params: merge(translationSetting, chainTranslate(message.content, targetLang)),
      trace: get().getCurrentTracePayload({ traceName: TraceNameMap.Translator }),
    });
  },

  ttsMessage: async (id, state = {}) => {
    await get().updateMessageTTS(id, state);
  },

  updateMessageTTS: async (id, data) => {
    await messageService.updateMessageTTS(id, data);
    await get().refreshMessages();
  },

  updateMessageTranslate: async (id, data) => {
    await messageService.updateMessageTranslate(id, data);

    await get().refreshMessages();
  },
});
