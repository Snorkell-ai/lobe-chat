import { readFileSync, writeFileSync } from 'node:fs';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { SPLIT } from './const';

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
export const updateDocs = (path: string, content: string) => {
  const md = readFileSync(path, 'utf8');
  const mds = md.split(SPLIT);
  mds[1] = [' ', content, ' '].join('\n\n');
  const result = mds.join(SPLIT);
  writeFileSync(path, result, 'utf8');
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
export const convertMarkdownToMdast = async (md: string) => {
  // @ts-ignore
  return unified().use(remarkParse).use(remarkGfm).parse(md.trim());
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
export const getTitle = async (path: string) => {
  const md = readFileSync(path, 'utf8');
  const mdast: any = await convertMarkdownToMdast(md);

  let title = '';
  visit(mdast, 'heading', (node) => {
    if (node.depth !== 1) return;
    visit(node, 'text', (heading) => {
      title += heading.value;
    });
  });
  return title;
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
export const genMdLink = (title: string, url: string) => {
  return `[${title}](${url})`;
};
