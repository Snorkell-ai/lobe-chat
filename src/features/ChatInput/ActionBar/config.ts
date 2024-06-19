import STT from '../STT';
import Clear from './Clear';
import FileUpload from './FileUpload';
import History from './History';
import ModelSwitch from './ModelSwitch';
import Temperature from './Temperature';
import Token from './Token';
import Tools from './Tools';

export const actionMap = {
  clear: Clear,
  fileUpload: FileUpload,
  history: History,
  model: ModelSwitch,
  stt: STT,
  temperature: Temperature,
  token: Token,
  tools: Tools,
} as const;

type ActionMap = typeof actionMap;

export type ActionKeys = keyof ActionMap;

type getActionList = (mobile?: boolean) => ActionKeys[];

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
// we can make these action lists configurable in the future
export const getLeftActionList: getActionList = (mobile) =>
  ['model', 'fileUpload', 'temperature', 'history', !mobile && 'stt', 'tools', 'token'].filter(
    Boolean,
  ) as ActionKeys[];

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
export const getRightActionList: getActionList = () => ['clear'].filter(Boolean) as ActionKeys[];
