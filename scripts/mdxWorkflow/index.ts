import { consola } from 'consola';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
const fixWinPath = (path: string) => path.replaceAll('\\', '/');

export const root = resolve(__dirname, '../..');

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
const run = () => {
  const posts = globSync(fixWinPath(resolve(root, 'docs/**/*.mdx')));

  for (const post of posts) {
    try {
      const mdx = readFileSync(post, 'utf8');
      if (!mdx || mdx.replaceAll(' ', '').replaceAll('\n', '') === '') {
        consola.error(post, 'is EMPTY !!!!!');
        unlinkSync(post);
        continue;
      }
      const { data, content } = matter(mdx);
      const formatedContent = content
        .replaceAll('\\<', '<')
        .replaceAll("{' '}\n", '')
        .replaceAll(`'<`, `'`)
        .replaceAll(`"<`, `"`)
        .replaceAll(`>'`, `'`)
        .replaceAll(`>"`, `"`)
        .replaceAll(' </', '\n</')
        .replaceAll(' </', '\n</')
        .replaceAll('}> width', '} width')
        .replaceAll("'[https", "'https")
        .replaceAll('"[https', '"https')
        .replaceAll(/]\(http(.*)\/>\)/g, '')
        .replaceAll(`\\*\\* `, '** ')
        .replaceAll(` \\*\\*`, ' **')
        .replaceAll(/\n{2,}/g, '\n\n');

      writeFileSync(post, matter.stringify(formatedContent, data));
    } catch (error) {
      consola.error(post);
      consola.error(error);
    }
  }
};

run();
