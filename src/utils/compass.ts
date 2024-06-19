import brotliPromise from 'brotli-wasm';

/**
 * @title 字符串压缩器
 */
export class StrCompressor {
  /**
   * @ignore
   */
  private instance!: {
    compress(buf: Uint8Array, options?: any): Uint8Array;
    decompress(buf: Uint8Array): Uint8Array;
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
  async init(): Promise<void> {
    this.instance = await brotliPromise; // Import is async in browsers due to wasm requirements!
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
  compress(str: string): string {
    const input = new TextEncoder().encode(str);

    const compressedData = this.instance.compress(input);

    return this.urlSafeBase64Encode(compressedData);
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
  decompress(str: string): string {
    const compressedData = this.urlSafeBase64Decode(str);

    const decompressedData = this.instance.decompress(compressedData);

    return new TextDecoder().decode(decompressedData);
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
  async compressAsync(str: string) {
    const brotli = await brotliPromise;

    const input = new TextEncoder().encode(str);

    const compressedData = brotli.compress(input);

    return this.urlSafeBase64Encode(compressedData);
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
  async decompressAsync(str: string) {
    const brotli = await brotliPromise;

    const compressedData = this.urlSafeBase64Decode(str);

    const decompressedData = brotli.decompress(compressedData);

    return new TextDecoder().decode(decompressedData);
  }

  private urlSafeBase64Encode = (data: Uint8Array): string => {
    const base64Str = btoa(String.fromCharCode(...data));
    return base64Str.replaceAll('+', '_0_').replaceAll('/', '_').replace(/=+$/, '');
  };

  private urlSafeBase64Decode = (data: string): Uint8Array => {
    let after = data.replaceAll('_0_', '+').replaceAll('_', '/');
    while (after.length % 4) {
      after += '=';
    }

    return new Uint8Array([...atob(after)].map((c) => c.charCodeAt(0)));
  };
}

export const Compressor = new StrCompressor();
