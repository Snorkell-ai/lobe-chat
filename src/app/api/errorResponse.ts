import { AgentRuntimeErrorType, ILobeAgentRuntimeErrorType } from '@/libs/agent-runtime';
import { ChatErrorType, ErrorResponse, ErrorType } from '@/types/fetch';

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
const getStatus = (errorType: ILobeAgentRuntimeErrorType | ErrorType) => {
  // InvalidAccessCode / InvalidAzureAPIKey / InvalidOpenAIAPIKey / InvalidZhipuAPIKey ....
  if (errorType.toString().includes('Invalid')) return 401;

  switch (errorType) {
    // TODO: Need to refactor to Invalid OpenAI API Key
    case AgentRuntimeErrorType.InvalidProviderAPIKey:
    case AgentRuntimeErrorType.NoOpenAIAPIKey: {
      return 401;
    }

    case AgentRuntimeErrorType.LocationNotSupportError: {
      return 403;
    }

    // define the 471~480 as provider error
    case AgentRuntimeErrorType.AgentRuntimeError: {
      return 470;
    }

    case AgentRuntimeErrorType.ProviderBizError:
    case AgentRuntimeErrorType.OpenAIBizError: {
      return 471;
    }

    case ChatErrorType.OllamaServiceUnavailable:
    case AgentRuntimeErrorType.OllamaBizError: {
      return 472;
    }
  }

  return errorType as number;
};

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
export const createErrorResponse = (
  errorType: ErrorType | ILobeAgentRuntimeErrorType,
  body?: any,
) => {
  const statusCode = getStatus(errorType);

  const data: ErrorResponse = { body, errorType };

  if (typeof statusCode !== 'number' || statusCode < 200 || statusCode > 599) {
    console.error(
      `current StatusCode: \`${statusCode}\` .`,
      'Please go to `./src/app/api/errorResponse.ts` to defined the statusCode.',
    );
  }

  return new Response(JSON.stringify(data), { status: statusCode });
};
