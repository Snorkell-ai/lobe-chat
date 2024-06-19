import { API_ENDPOINTS } from '@/services/_url';
import { useUserStore } from '@/store/user';
import { preferenceSelectors } from '@/store/user/selectors';
import { TraceEventBasePayload, TraceEventPayloads } from '@/types/trace';

class TraceService {
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
  private async request<T>(data: T) {
    try {
      return fetch(API_ENDPOINTS.trace, {
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
    } catch (e) {
      console.error(e);
    }
  }

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
  async traceEvent(data: TraceEventPayloads & TraceEventBasePayload) {
    const enabled = preferenceSelectors.userAllowTrace(useUserStore.getState());

    if (!enabled) return;

    return this.request(data);
  }
}

export const traceService = new TraceService();
