import { FormInstance } from 'antd/es/form/hooks/useForm';
import { useLayoutEffect } from 'react';

import { useUserStore } from '@/store/user';

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
export const useSyncSettings = (form: FormInstance) => {
  useLayoutEffect(() => {
    // set the first time
    form.setFieldsValue(useUserStore.getState().settings);

    // sync with later updated settings
    const unsubscribe = useUserStore.subscribe(
      (s) => s.settings,
      (settings) => {
        form.setFieldsValue(settings);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);
};
