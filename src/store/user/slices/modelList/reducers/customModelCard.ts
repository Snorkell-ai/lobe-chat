import { produce } from 'immer';

import { ChatModelCard } from '@/types/llm';

export interface AddCustomModelCard {
  modelCard: ChatModelCard;
  type: 'add';
}

export interface DeleteCustomModelCard {
  id: string;
  type: 'delete';
}

export interface UpdateCustomModelCard {
  id: string;
  type: 'update';
  value: Partial<ChatModelCard>;
}

export type CustomModelCardDispatch =
  | AddCustomModelCard
  | DeleteCustomModelCard
  | UpdateCustomModelCard;

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
export const customModelCardsReducer = (
  state: ChatModelCard[] | undefined,
  payload: CustomModelCardDispatch,
): ChatModelCard[] => {
  switch (payload.type) {
    case 'add': {
      return produce(state || [], (draftState) => {
        const { id } = payload.modelCard;
        if (!id) return;
        if (draftState.some((card) => card.id === id)) return;

        draftState.push(payload.modelCard);
      });
    }

    case 'delete': {
      return produce(state || [], (draftState) => {
        const index = draftState.findIndex((card) => card.id === payload.id);
        if (index !== -1) {
          draftState.splice(index, 1);
        }
      });
    }

    case 'update': {
      return produce(state || [], (draftState) => {
        const index = draftState.findIndex((card) => card.id === payload.id);
        if (index !== -1) {
          const card = draftState[index];
          Object.assign(card, payload.value);
        }
      });
    }

    default: {
      throw new Error('Unhandled action type in customModelCardsReducer');
    }
  }
};
