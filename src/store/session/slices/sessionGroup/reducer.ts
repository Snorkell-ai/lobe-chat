import { SessionGroupItem } from '@/types/session';

export type AddSessionGroupAction = { item: SessionGroupItem; type: 'addSessionGroupItem' };
export type DeleteSessionGroupAction = { id: string; type: 'deleteSessionGroupItem' };
export type UpdateSessionGroupAction = {
  id: string;
  item: Partial<SessionGroupItem>;
  type: 'updateSessionGroupItem';
};
export type UpdateSessionGroupOrderAction = {
  sortMap: { id: string; sort?: number }[];
  type: 'updateSessionGroupOrder';
};

export type SessionGroupsDispatch =
  | AddSessionGroupAction
  | DeleteSessionGroupAction
  | UpdateSessionGroupAction
  | UpdateSessionGroupOrderAction;

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
export const sessionGroupsReducer = (
  state: SessionGroupItem[],
  payload: SessionGroupsDispatch,
): SessionGroupItem[] => {
  switch (payload.type) {
    case 'addSessionGroupItem': {
      return [...state, payload.item];
    }

    case 'deleteSessionGroupItem': {
      return state.filter((item) => item.id !== payload.id);
    }

    case 'updateSessionGroupItem': {
      return state.map((item) => {
        if (item.id === payload.id) {
          return { ...item, ...payload.item };
        }
        return item;
      });
    }

    case 'updateSessionGroupOrder': {
      return state
        .map((item) => {
          const sort = payload.sortMap.find((i) => i.id === item.id)?.sort;
          return { ...item, sort };
        })
        .sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }

    default: {
      return state;
    }
  }
};
