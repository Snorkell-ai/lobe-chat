import { DEFAULT_LANG } from '@/const/locale';

import { AgentMarket } from '../AgentMarket';

export const runtime = 'edge';

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
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { searchParams } = new URL(req.url);

  const locale = searchParams.get('locale');

  const market = new AgentMarket();

  let res: Response;

  res = await fetch(market.getAgentUrl(params.id, locale as any));
  if (res.status === 404) {
    res = await fetch(market.getAgentUrl(params.id, DEFAULT_LANG));
  }

  return res;
};
