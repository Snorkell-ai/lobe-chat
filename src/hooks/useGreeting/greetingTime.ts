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
export const parseGreetingTime = () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 4 && hours < 11) {
    return 'morning';
  } else if (hours >= 11 && hours < 14) {
    return 'noon';
  } else if (hours >= 14 && hours < 18) {
    return 'afternoon';
  } else {
    return 'night';
  }
};
