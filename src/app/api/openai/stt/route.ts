import { OpenAISTTPayload } from '@lobehub/tts';
import { createOpenaiAudioTranscriptions } from '@lobehub/tts/server';

import { getPreferredRegion } from '../../config';
import { createBizOpenAI } from '../createBizOpenAI';

export const runtime = 'edge';
export const preferredRegion = getPreferredRegion();

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
export const POST = async (req: Request) => {
  const formData = await req.formData();
  const speechBlob = formData.get('speech') as Blob;
  const optionsString = formData.get('options') as string;
  const payload = {
    options: JSON.parse(optionsString),
    speech: speechBlob,
  } as OpenAISTTPayload;

  const openaiOrErrResponse = createBizOpenAI(req);

  // if resOrOpenAI is a Response, it means there is an error,just return it
  if (openaiOrErrResponse instanceof Response) return openaiOrErrResponse;

  const res = await createOpenaiAudioTranscriptions({ openai: openaiOrErrResponse, payload });

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};
