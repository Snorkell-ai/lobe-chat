import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { ChatStoreState, initialState } from './initialState';
import { ChatBuiltinToolAction, chatToolSlice } from './slices/builtinTool/action';
import { ChatEnhanceAction, chatEnhance } from './slices/enchance/action';
import { ChatMessageAction, chatMessage } from './slices/message/action';
import { ChatPluginAction, chatPlugin } from './slices/plugin/action';
import { ShareAction, chatShare } from './slices/share/action';
import { ChatTopicAction, chatTopic } from './slices/topic/action';

export interface ChatStoreAction
  extends ChatMessageAction,
    ChatTopicAction,
    ShareAction,
    ChatEnhanceAction,
    ChatPluginAction,
    ChatBuiltinToolAction {}

export type ChatStore = ChatStoreAction & ChatStoreState;

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
//  ===============  聚合 createStoreFn ============ //

const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (...params) => ({
  ...initialState,

  ...chatMessage(...params),
  ...chatTopic(...params),
  ...chatShare(...params),
  ...chatEnhance(...params),
  ...chatToolSlice(...params),
  ...chatPlugin(...params),
});

//  ===============  实装 useStore ============ //
const devtools = createDevtools('chat');

export const useChatStore = createWithEqualityFn<ChatStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
