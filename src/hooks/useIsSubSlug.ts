import { usePathname } from 'next/navigation';

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
export const useIsSubSlug = () => {
  const pathname = usePathname();

  const slugs = pathname.split('/').filter(Boolean);

  return slugs.length > 1;
};
