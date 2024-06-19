export const LOADING_FLAT = '...';

//  start with this，it should be a function message
export const FUNCTION_MESSAGE_FLAG = '{"tool_calls"';

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
export const isFunctionMessageAtStart = (content: string) => {
  return content.startsWith(FUNCTION_MESSAGE_FLAG);
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
export const testFunctionMessageAtEnd = (content: string) => {
  const regExp = /{"tool_calls":.*?]}$/;
  const match = content?.trim().match(regExp);

  return { content: match ? match[0] : '', valid: !!match };
};
