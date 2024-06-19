import { DEFAULT_AGENTS_MARKET_ITEM } from '@/const/market';
import { AgentsMarketItem } from '@/types/market';

import type { Store } from './store';

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
const getAgentList = (s: Store) => {
  const { searchKeywords, agentList } = s;
  if (!searchKeywords) return agentList;
  return agentList.filter(({ meta }) => {
    const checkMeta: string = [meta.tags, meta.title, meta.description, meta.avatar]
      .filter(Boolean)
      .join('');
    return checkMeta.toLowerCase().includes(searchKeywords.toLowerCase());
  });
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
const getAgentTagList = (s: Store) => s.tagList;

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
const getAgentItemById = (d: string) => (s: Store) => s.agentMap[d];

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
const currentAgentItem = (s: Store) => getAgentItemById(s.currentIdentifier)(s);

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
const currentAgentItemSafe = (s: Store): AgentsMarketItem => {
  const item = getAgentItemById(s.currentIdentifier)(s);
  if (!item) return DEFAULT_AGENTS_MARKET_ITEM;

  return item;
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
const showSideBar = (s: Store) => !!s.currentIdentifier;

export const agentMarketSelectors = {
  currentAgentItem,
  currentAgentItemSafe,
  getAgentItemById,
  getAgentList,
  getAgentTagList,
  showSideBar,
};
