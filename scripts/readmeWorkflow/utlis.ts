import { kebabCase } from 'lodash';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AGENT_CN_URL, AGENT_EN_URL, PLUGIN_CN_URL, PLUGIN_EN_URL } from './const';

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
const fetchIndex = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
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
export const fetchAgentIndex = async (lang: string) => {
  const isCN = lang === 'zh-CN';
  const url = isCN ? AGENT_CN_URL : AGENT_EN_URL;
  const data = await fetchIndex(url);
  return data.agents;
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
export const fetchPluginIndex = async (lang: string) => {
  const isCN = lang === 'zh-CN';
  const url = isCN ? PLUGIN_CN_URL : PLUGIN_EN_URL;
  const data = await fetchIndex(url);
  return data.plugins;
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
export const genLink = (title: string, url: string) => `[${title}](${url})`;

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
export const genTags = (tags: string[]) =>
  tags
    .filter(Boolean)
    .map((tag) => `\`${kebabCase(tag)}\``)
    .join(' ');

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
const getReadmePath = (lang: string) => {
  const isCN = lang === 'zh-CN';
  return resolve(__dirname, '../../', isCN ? `./README.zh-CN.md` : `./README.md`);
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
export const readReadme = (lang: string): string => {
  return readFileSync(getReadmePath(lang), 'utf8');
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
export const writeReadme = (content: string, lang: string) => {
  writeFileSync(getReadmePath(lang), content, 'utf8');
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
export const updateReadme = (split: string, md: string, content: string): string => {
  const mds = md.split(split);
  mds[1] = [' ', content, ' '].join('\n\n');

  return mds.join(split);
};
