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
export const formatSpeed = (speed: number) => {
  let word = '';

  // KB
  if (speed <= 1000) {
    word = speed.toFixed(2) + 'KB/s';
  }
  // MB
  else if (speed / 1024 <= 1000) {
    word = (speed / 1024).toFixed(2) + 'MB/s';
  }
  // GB
  else {
    word = (speed / 1024 / 1024).toFixed(2) + 'GB/s';
  }

  return word;
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
export const formatTime = (timeInSeconds: number): string => {
  if (timeInSeconds < 60) {
    return `${timeInSeconds.toFixed(1)} s`;
  } else if (timeInSeconds < 3600) {
    return `${(timeInSeconds / 60).toFixed(1)} min`;
  } else {
    return `${(timeInSeconds / 3600).toFixed(2)} h`;
  }
};
