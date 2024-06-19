import { produce } from 'immer';

import { LobeAgentSession, LobeSessions } from '@/types/session';

interface AddSession {
  session: LobeAgentSession;
  type: 'addSession';
}

interface RemoveSession {
  id: string;
  type: 'removeSession';
}

interface UpdateSession {
  id: string;
  type: 'updateSession';
  value: Partial<LobeAgentSession>;
}

export type SessionDispatch = AddSession | RemoveSession | UpdateSession;

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
export const sessionsReducer = (state: LobeSessions, payload: SessionDispatch): LobeSessions => {
  switch (payload.type) {
    case 'addSession': {
      return produce(state, (draft) => {
        const { session } = payload;
        if (!session) return;

        // TODO: 后续将 Date 类型做个迁移，就可以移除这里的 ignore 了
        // @ts-ignore
        draft.unshift({ ...session, createdAt: new Date(), updatedAt: new Date() });
      });
    }

    case 'removeSession': {
      return produce(state, (draftState) => {
        const index = draftState.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          draftState.splice(index, 1);
        }
      });
    }

    case 'updateSession': {
      return produce(state, (draftState) => {
        const { value, id } = payload;
        const index = draftState.findIndex((item) => item.id === id);

        if (index !== -1) {
          // @ts-ignore
          draftState[index] = { ...draftState[index], ...value, updatedAt: new Date() };
        }
      });
    }

    default: {
      return produce(state, () => {});
    }
  }
};
