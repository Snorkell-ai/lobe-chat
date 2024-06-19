import { startTransition, useEffect, useState } from 'react';

import { encodeAsync } from '@/utils/tokenizer';

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
export const useTokenCount = (input: string = '') => {
  const [value, setNum] = useState(0);

  useEffect(() => {
    startTransition(() => {
      encodeAsync(input || '')
        .then(setNum)
        .catch(() => {
          // 兜底采用字符数
          setNum(input.length);
        });
    });
  }, [input]);

  return value;
};
