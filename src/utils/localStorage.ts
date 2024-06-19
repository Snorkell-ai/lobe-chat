const PREV_KEY = 'LOBE_GLOBAL';

// LOBE_PREFERENCE for userStore
// LOBE_GLOBAL_PREFERENCE for globalStore
type StorageKey = 'LOBE_PREFERENCE' | 'LOBE_SYSTEM_STATUS';

export class AsyncLocalStorage<State> {
  private storageKey: StorageKey;

  constructor(storageKey: StorageKey) {
    this.storageKey = storageKey;

    // skip server side rendering
    if (typeof window === 'undefined') return;

    // migrate old data
    if (localStorage.getItem(PREV_KEY)) {
      const data = JSON.parse(localStorage.getItem(PREV_KEY) || '{}');

      const preference = data.state.preference;

      if (data.state?.preference) {
        localStorage.setItem('LOBE_PREFERENCE', JSON.stringify(preference));
      }
      localStorage.removeItem(PREV_KEY);
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
  async saveToLocalStorage(state: object) {
    const data = await this.getFromLocalStorage();

    localStorage.setItem(this.storageKey, JSON.stringify({ ...data, ...state }));
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
  async getFromLocalStorage(key: StorageKey = this.storageKey): Promise<State> {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}
