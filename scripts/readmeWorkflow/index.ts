import { consola } from 'consola';

import syncAgentIndex from './syncAgentIndex';
import syncPluginIndex from './syncPluginIndex';

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
const runSync = async () => {
  consola.start('Start sync readme workflow...');
  await syncAgentIndex();
  await syncPluginIndex();
};

runSync();
