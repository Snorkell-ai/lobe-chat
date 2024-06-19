import { useMemo } from 'react';

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
export const useParseContent = (content: string) => {
  let isJSON = true;

  try {
    JSON.parse(content);
  } catch {
    isJSON = false;
  }

  const data = isJSON ? JSON.parse(content) : content;

  return useMemo(() => ({ data, isJSON }), [content]);
};
