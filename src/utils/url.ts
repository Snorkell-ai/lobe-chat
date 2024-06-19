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
export const pathString = (
  path: string,
  {
    hash = '',
    search = '',
  }: {
    hash?: string;
    search?: string;
  } = {},
) => {
  const tempBase = 'https://a.com';
  const url = new URL(path, tempBase);

  if (hash) url.hash = hash;
  if (search) url.search = search;
  return url.toString().replace(tempBase, '');
};
