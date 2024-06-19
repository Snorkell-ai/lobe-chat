import { TextAreaRef } from 'antd/es/input/TextArea';
import { RefObject, useEffect } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

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
export const useAutoFocus = (inputRef: RefObject<TextAreaRef>) => {
  const chatKey = useChatStore(chatSelectors.currentChatKey);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatKey]);
};
