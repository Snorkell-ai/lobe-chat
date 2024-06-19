import { TraceEventType } from '@/const/trace';
import { TraceClient } from '@/libs/traces';
import { TraceEventBasePayload, TraceEventPayloads } from '@/types/trace';

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
export const POST = async (req: Request) => {
  type RequestData = TraceEventPayloads & TraceEventBasePayload;
  const data = (await req.json()) as RequestData;
  const { traceId, eventType } = data;

  const traceClient = new TraceClient();

  const eventClient = traceClient.createEvent(traceId);

  switch (eventType) {
    case TraceEventType.ModifyMessage: {
      eventClient?.modifyMessage(data);
      break;
    }

    case TraceEventType.DeleteAndRegenerateMessage: {
      eventClient?.deleteAndRegenerateMessage(data);
      break;
    }

    case TraceEventType.RegenerateMessage: {
      eventClient?.regenerateMessage(data);
      break;
    }

    case TraceEventType.CopyMessage: {
      eventClient?.copyMessage(data);
      break;
    }
  }

  await traceClient.shutdownAsync();
  return new Response(undefined, { status: 201 });
};
