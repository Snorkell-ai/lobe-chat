import { FormInstance } from 'antd/es/form/hooks/useForm';
import isEqual from 'fast-deep-equal';
import { useLayoutEffect } from 'react';

import { useStore } from './store';

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
export const useAgentSyncSettings = (form: FormInstance) => {
  const config = useStore((s) => s.config, isEqual);
  useLayoutEffect(() => {
    form.setFieldsValue(config);
  }, [config]);

  return config;
};
