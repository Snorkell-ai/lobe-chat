import { DeepPartial } from 'utility-types';

import { LOBE_URL_IMPORT_NAME } from '@/const/url';
import { ShareGPTConversation } from '@/types/share';
import { UserSettings } from '@/types/user/settings';
import { withBasePath } from '@/utils/basePath';
import { parseMarkdown } from '@/utils/parseMarkdown';

export const SHARE_GPT_URL = 'https://sharegpt.com/api/conversations';

class ShareService {
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
  public async createShareGPTUrl(conversation: ShareGPTConversation) {
    const items = [];

    for (const item of conversation.items) {
      items.push({
        from: item.from,
        value: item.from === 'gpt' ? await parseMarkdown(item.value) : item.value,
      });
    }

    const res = await fetch(SHARE_GPT_URL, {
      body: JSON.stringify({ ...conversation, items }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const { id } = await res.json();

    if (!id) throw new Error('Failed to create ShareGPT URL');

    // short link to the ShareGPT post
    return `https://shareg.pt/${id}`;
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
  public createShareSettingsUrl(settings: DeepPartial<UserSettings>) {
    return withBasePath(`/?${LOBE_URL_IMPORT_NAME}=${encodeURI(JSON.stringify(settings))}`);
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
  public decodeShareSettings(settings: string) {
    try {
      return { data: JSON.parse(settings) as DeepPartial<UserSettings> };
    } catch (e) {
      return { message: JSON.stringify(e) };
    }
  }
}

export const shareService = new ShareService();
