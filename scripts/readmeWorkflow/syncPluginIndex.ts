import { consola } from 'consola';
import { markdownTable } from 'markdown-table';

import { DataItem, PLGUIN_URL, PLUGIN_REPO, PLUGIN_SPLIT } from './const';
import { fetchPluginIndex, genLink, genTags, readReadme, updateReadme, writeReadme } from './utlis';

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
const genPluginTable = (data: DataItem[], lang: string) => {
  const isCN = lang === 'zh-CN';
  const content = data
    .slice(0, 4)
    .map((item) => [
      [
        genLink(item.meta.title.replaceAll('|', ','), PLGUIN_URL),
        `<sup>By **${item.author}** on **${item.createdAt}**</sup>`,
      ].join('<br/>'),
      [item.meta.description.replaceAll('|', ','), genTags(item.meta.tags)].join('<br/>'),
    ]);
  return markdownTable([
    isCN ? ['最近新增', '插件描述'] : ['Recent Submits', 'Description'],
    ...content,
  ]);
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
const runPluginTable = async (lang: string) => {
  const data = await fetchPluginIndex(lang);
  const md = readReadme(lang);
  const mdTable = genPluginTable(data, lang);
  const newMd = updateReadme(
    PLUGIN_SPLIT,
    md,
    [mdTable, `> 📊 Total plugins: ${genLink(`<kbd>**${data.length}**</kbd>`, PLUGIN_REPO)}`].join(
      '\n\n',
    ),
  );
  writeReadme(newMd, lang);
  consola.success('Sync plugin index success!');
};

export default async () => {
  await runPluginTable('en-US');
  await runPluginTable('zh-CN');
};
