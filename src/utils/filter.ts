import { BaseDataModel } from '@/types/meta';

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
export const filterWithKeywords = <T extends BaseDataModel>(
  map: Record<string, T>,
  keywords: string,
  extraSearchStr?: (item: T) => string | string[],
) => {
  if (!keywords) return map;

  return Object.fromEntries(
    Object.entries(map).filter(([, item]) => {
      const meta = item.meta;

      const keyList = [meta.title, meta.description, meta.tags?.join('')].filter(
        Boolean,
      ) as string[];

      const defaultSearchKey = keyList.join('');

      let extraSearchKey: string = '';
      if (extraSearchStr) {
        const searchStr = extraSearchStr(item);
        extraSearchKey = Array.isArray(searchStr) ? searchStr.join('') : searchStr;
      }

      return `${defaultSearchKey}${extraSearchKey}`.toLowerCase().includes(keywords.toLowerCase());
    }),
  );
};
