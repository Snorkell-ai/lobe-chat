import { FilesStoreState } from '../../initialState';

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
const getImageDetailByList = (list: string[]) => (s: FilesStoreState) =>
  list
    .map((i) => s.imagesMap[i])
    .filter(Boolean)
    .map((i) => ({ ...i, loading: s.uploadingIds.includes(i.id) }));

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
const imageDetailList = (s: FilesStoreState) => getImageDetailByList(s.inputFilesList)(s);

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
const getImageUrlOrBase64ById =
  (id: string) =>
  (s: FilesStoreState): { id: string; url: string } | undefined => {
    const preview = s.imagesMap[id];

    if (!preview) return undefined;

    const url = preview.saveMode === 'local' ? (preview.base64Url as string) : preview.url;

    return { id, url: url };
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
const getImageUrlOrBase64ByList = (idList: string[]) => (s: FilesStoreState) =>
  idList.map((i) => getImageUrlOrBase64ById(i)(s)).filter(Boolean) as {
    id: string;
    url: string;
  }[];

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
const imageUrlOrBase64List = (s: FilesStoreState) => getImageUrlOrBase64ByList(s.inputFilesList)(s);

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
const isImageUploading = (s: FilesStoreState) => s.uploadingIds.length > 0;

export const filesSelectors = {
  getImageDetailByList,
  getImageUrlOrBase64ById,
  getImageUrlOrBase64ByList,
  imageDetailList,
  imageUrlOrBase64List,
  isImageUploading,
};
