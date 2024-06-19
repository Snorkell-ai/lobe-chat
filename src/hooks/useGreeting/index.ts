import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { parseGreetingTime } from './greetingTime';

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
export const useGreeting = () => {
  const { t } = useTranslation('welcome');

  const [greeting, setGreeting] = useState<'morning' | 'noon' | 'afternoon' | 'night'>();

  useEffect(() => {
    setGreeting(parseGreetingTime());
  }, []);

  return greeting && t(`guide.welcome.${greeting}`);
};
