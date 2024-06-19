import { DEBUG_MODEL } from '@/database/client/models/__DEBUG';

class DebugService {
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
  async insertLargeDataToDB() {
    await DEBUG_MODEL.createRandomData({
      messageCount: 100_000,
      sessionCount: 40,
      startIndex: 0,
      topicCount: 200,
    });

    console.log('已插入10w');

    await DEBUG_MODEL.createRandomData({
      messageCount: 300_000,
      sessionCount: 40,
      startIndex: 100_001,
      topicCount: 200,
    });
    console.log('已插入40w');

    await DEBUG_MODEL.createRandomData({
      messageCount: 300_000,
      sessionCount: 40,
      startIndex: 400_001,
      topicCount: 200,
    });
    console.log('已插入70w');

    await DEBUG_MODEL.createRandomData({
      messageCount: 300_000,
      sessionCount: 40,
      startIndex: 700_001,
      topicCount: 200,
    });
    console.log('已插入100w');
  }
}

export const debugService = new DebugService();
