import { consola } from 'consola';
import { markdownTable } from 'markdown-table';
import qs from 'query-string';

import { AGENT_REPO, AGENT_SPLIT, DataItem, MARKET_URL } from './const';
import { fetchAgentIndex, genLink, genTags, readReadme, updateReadme, writeReadme } from './utlis';

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
const genAgentTable = (data: DataItem[], lang: string) => {
  const isCN = lang === 'zh-CN';
  const content = data.slice(0, 4).map((item) => [
    [
      genLink(
        item.meta.title.replaceAll('|', ','),
        qs.stringifyUrl({
          query: { agent: item.identifier },
          url: MARKET_URL,
        }),
      ),
      `<sup>By **${genLink(item.author, item.homepage)}** on **${(item as any).createAt}**</sup>`,
    ].join('<br/>'),
    [item.meta.description.replaceAll('|', ','), genTags(item.meta.tags)].join('<br/>'),
  ]);
  return markdownTable([
    isCN ? ['最近新增', '助手说明'] : ['Recent Submits', 'Description'],
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
const runAgentTable = async (lang: string) => {
  const data = await fetchAgentIndex(lang);
  const md = readReadme(lang);
  const mdTable = genAgentTable(data, lang);
  const newMd = updateReadme(
    AGENT_SPLIT,
    md,
    [mdTable, `> 📊 Total agents: ${genLink(`<kbd>**${data.length}**</kbd> `, AGENT_REPO)}`].join(
      '\n\n',
    ),
  );
  writeReadme(newMd, lang);
  consola.success('Sync agent index success!');
};

export default async () => {
  await runAgentTable('en-US');
  await runAgentTable('zh-CN');
};
