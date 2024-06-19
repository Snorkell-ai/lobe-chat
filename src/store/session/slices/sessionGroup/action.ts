import { t } from 'i18next';
import { StateCreator } from 'zustand/vanilla';

import { message } from '@/components/AntdStaticMethods';
import { sessionService } from '@/services/session';
import { SessionStore } from '@/store/session';
import { SessionGroupItem } from '@/types/session';

import { SessionGroupsDispatch, sessionGroupsReducer } from './reducer';

/* eslint-disable typescript-sort-keys/interface */
export interface SessionGroupAction {
  addSessionGroup: (name: string) => Promise<string>;
  clearSessionGroups: () => Promise<void>;
  removeSessionGroup: (id: string) => Promise<void>;
  updateSessionGroupName: (id: string, name: string) => Promise<void>;
  updateSessionGroupSort: (items: SessionGroupItem[]) => Promise<void>;
  internal_dispatchSessionGroups: (payload: SessionGroupsDispatch) => void;
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
/* eslint-enable */

export const createSessionGroupSlice: StateCreator<
  SessionStore,
  [['zustand/devtools', never]],
  [],
  SessionGroupAction
> = (set, get) => ({
  addSessionGroup: async (name) => {
    const id = await sessionService.createSessionGroup(name);

    await get().refreshSessions();

    return id;
  },

  clearSessionGroups: async () => {
    await sessionService.removeSessionGroups();
    await get().refreshSessions();
  },

  removeSessionGroup: async (id) => {
    await sessionService.removeSessionGroup(id);
    await get().refreshSessions();
  },

  updateSessionGroupName: async (id, name) => {
    await sessionService.updateSessionGroup(id, { name });
    await get().refreshSessions();
  },
  updateSessionGroupSort: async (items) => {
    const sortMap = items.map((item, index) => ({ id: item.id, sort: index }));

    get().internal_dispatchSessionGroups({ sortMap, type: 'updateSessionGroupOrder' });

    message.loading({
      content: t('sessionGroup.sorting', { ns: 'chat' }),
      duration: 0,
      key: 'updateSessionGroupSort',
    });

    await sessionService.updateSessionGroupOrder(sortMap);
    message.destroy('updateSessionGroupSort');
    message.success(t('sessionGroup.sortSuccess', { ns: 'chat' }));

    await get().refreshSessions();
  },

  /* eslint-disable sort-keys-fix/sort-keys-fix */
  internal_dispatchSessionGroups: (payload) => {
    const nextSessionGroups = sessionGroupsReducer(get().sessionGroups, payload);
    get().internal_processSessions(get().sessions, nextSessionGroups, 'updateSessionGroups');
  },
});
