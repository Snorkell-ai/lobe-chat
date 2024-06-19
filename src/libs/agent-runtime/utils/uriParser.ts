interface UriParserResult {
  base64: string | null;
  mimeType: string | null;
  type: 'url' | 'base64' | null;
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
export const parseDataUri = (dataUri: string): UriParserResult => {
  // 正则表达式匹配整个 Data URI 结构
  const dataUriMatch = dataUri.match(/^data:([^;]+);base64,(.+)$/);

  if (dataUriMatch) {
    // 如果是合法的 Data URI
    return { base64: dataUriMatch[2], mimeType: dataUriMatch[1], type: 'base64' };
  }

  try {
    new URL(dataUri);
    // 如果是合法的 URL
    return { base64: null, mimeType: null, type: 'url' };
  } catch {
    // 既不是 Data URI 也不是合法 URL
    return { base64: null, mimeType: null, type: null };
  }
};
