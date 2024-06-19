import { DEFAULT_LANG } from '@/const/locale';

import { PluginStore } from './Store';

export const runtime = 'edge';

export const revalidate = 43_200; /**
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
// revalidate at almost every 12 hours

export const GET = async (req: Request) => {
  const locale = new URL(req.url).searchParams.get('locale');

  const pluginStore = new PluginStore();

  let res: Response;

  res = await fetch(pluginStore.getPluginIndexUrl(locale as any));

  if (res.status === 404) {
    res = await fetch(pluginStore.getPluginIndexUrl(DEFAULT_LANG));
  }

  return res;
};
