import type { KnowledgePage, PageKind } from './content';

export const kindLabels: Record<PageKind, string> = {
  indexes: '索引',
  platforms: '平台',
  modules: '功能模块',
  issues: '问题排查',
  workflows: '调试流程',
  tools: '调试工具',
  cases: '调试案例',
  logs: '更新记录',
  other: '其他',
};

export const kindDescriptions: Record<PageKind, string> = {
  indexes: '跨平台导航与聚合入口。',
  platforms: 'Sensor、ISP、方案和厂家主体知识。',
  modules: '图像处理模块的作用、参数、观察项与调试方法。',
  issues: '常见图像问题的现象、原因、排查顺序和平台差异。',
  workflows: '面向具体平台或问题类型的调试流程。',
  tools: '调试工具用途、页面、操作步骤与注意事项。',
  cases: '历史案例入口。',
  logs: '知识库内容更新记录。',
  other: '未归类知识页面。',
};

export function pagesForKind(pages: KnowledgePage[], kind: PageKind): KnowledgePage[] {
  return pages.filter((page) => page.kind === kind).sort(sortByTitle);
}

export function groupPagesByPlatform(pages: KnowledgePage[]): Map<string, KnowledgePage[]> {
  const groups = new Map<string, KnowledgePage[]>();

  for (const page of pages) {
    const platform = getPagePlatform(page);
    const group = groups.get(platform) ?? [];
    group.push(page);
    groups.set(platform, group);
  }

  return new Map(
    [...groups.entries()]
      .map(([platform, group]) => [platform, group.sort(sortByModuleThenTitle)] as const)
      .sort(([a], [b]) => comparePlatform(a, b)),
  );
}

export function getPagePlatform(page: KnowledgePage): string {
  const fromAttribute = cleanAttributeValue(page.attributes['平台']);
  if (fromAttribute) return fromAttribute;

  const fileName = page.relativePath.split('/').pop()?.replace(/\.md$/i, '') ?? page.title;
  const prefix = fileName.match(/^([A-Za-z]+\d+[A-Za-z]*)_/)?.[1];
  if (prefix) return prefix;

  return '通用';
}

export function getPageModuleName(page: KnowledgePage): string {
  const fromAttribute = cleanAttributeValue(page.attributes['模块']);
  if (fromAttribute) return fromAttribute;

  const fileName = page.relativePath.split('/').pop()?.replace(/\.md$/i, '') ?? page.title;
  return fileName.replace(/^[A-Za-z]+\d+[A-Za-z]*_/, '') || page.title;
}

export function featuredPages(pages: KnowledgePage[]): KnowledgePage[] {
  const preferred = [
    'ISP调试知识库导航',
    '问题分类索引',
    'ISX031_索引',
    'SC121AT_索引',
    'SC361AT_索引',
    'GW5_索引',
    'ISX031',
    'SC121AT',
    'SC361AT',
    'GW5',
    '偏色',
    '噪声大',
  ];
  return preferred
    .map((title) => pages.find((page) => page.title === title || page.slug.endsWith(`/${title}`)))
    .filter((page): page is KnowledgePage => Boolean(page));
}

export function groupByAttribute(pages: KnowledgePage[], attribute: string): Map<string, KnowledgePage[]> {
  const groups = new Map<string, KnowledgePage[]>();
  for (const page of pages) {
    const value = page.attributes[attribute];
    if (!value) continue;
    for (const item of value.split(/[、,，/]/).map((entry) => entry.trim()).filter(Boolean)) {
      const group = groups.get(item) ?? [];
      group.push(page);
      groups.set(item, group);
    }
  }
  return new Map([...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'zh-Hans-CN')));
}

function sortByTitle(a: KnowledgePage, b: KnowledgePage): number {
  return a.title.localeCompare(b.title, 'zh-Hans-CN');
}

function sortByModuleThenTitle(a: KnowledgePage, b: KnowledgePage): number {
  return getPageModuleName(a).localeCompare(getPageModuleName(b), 'zh-Hans-CN') || sortByTitle(a, b);
}

function comparePlatform(a: string, b: string): number {
  if (a === '通用') return 1;
  if (b === '通用') return -1;
  return a.localeCompare(b, 'zh-Hans-CN');
}

function cleanAttributeValue(value: string | undefined): string {
  if (!value) return '';
  return value
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => label || target.split('/').pop())
    .replace(/^wiki\/platforms\//, '')
    .trim();
}

