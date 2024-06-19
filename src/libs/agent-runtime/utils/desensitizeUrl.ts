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
export const desensitizeUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const hostnameParts = urlObj.hostname.split('.');
    const port = urlObj.port;

    // Desensitize domain only if there are at least two parts (example.com)
    if (hostnameParts.length > 1) {
      // Desensitize the second level domain (second part from the right)
      // Special case for short domain names
      const secondLevelDomainIndex = hostnameParts.length - 2;
      if (hostnameParts[secondLevelDomainIndex].length < 5) {
        hostnameParts[secondLevelDomainIndex] = '***';
      } else {
        hostnameParts[secondLevelDomainIndex] = hostnameParts[secondLevelDomainIndex].replace(
          /^(.*?)(\w{2})(\w+)(\w{2})$/,
          (_, prefix, start, middle, end) => `${prefix}${start}****${end}`,
        );
      }
    }

    // Join the hostname parts back together
    const desensitizedHostname = hostnameParts.join('.');

    // Desensitize port if present
    const desensitizedPort = port ? ':****' : '';

    // Reconstruct the URL with the desensitized parts
    return `${urlObj.protocol}//${desensitizedHostname}${desensitizedPort}${urlObj.pathname}${urlObj.search}`;
  } catch {
    // If the URL is invalid, return the original URL
    return url;
  }
};
