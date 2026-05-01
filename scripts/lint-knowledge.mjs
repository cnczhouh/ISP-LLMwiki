#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const PROPERTY_HEADINGS = new Set(['页面属性', '平台属性']);
const SOURCE_HEADINGS = new Set(['来源', '已有原始资料', '资料来源', '参考资料']);
const ALLOWED_WIKI_DIRS = new Set(['indexes', 'platforms', 'modules', 'issues', 'workflows', 'tools', 'cases']);
const TYPE_HINTS = {
  indexes: /索引/,
  platforms: /(平台|Sensor|ISP|Solution|Vendor)/i,
  modules: /模块/,
  issues: /问题/,
  workflows: /流程/,
  tools: /工具/,
  cases: /案例/,
};

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const rootDir = path.resolve(args.root || process.env.KNOWLEDGE_ROOT || 'knowledge');
const wikiDir = path.join(rootDir, 'wiki');
const findings = [];

if (!fs.existsSync(wikiDir)) {
  addFinding('error', 'root', rootDir, `未找到 wiki 目录：${wikiDir}`);
  printReport([], findings, args);
  process.exit(2);
}

const pages = walkMarkdownFiles(wikiDir).map(readPage);
const pageIndex = buildPageIndex(pages);

checkDuplicateTitles(pages);

for (const page of pages) {
  checkLocation(page);
  checkNaming(page);
  checkProperties(page);
  checkSources(page);
  checkLinks(page, pageIndex);
}

checkLinkCoverage(pages, pageIndex);
printReport(pages, findings, args);

const errorCount = findings.filter((finding) => finding.level === 'error').length;
const warningCount = findings.filter((finding) => finding.level === 'warn').length;
process.exit(errorCount > 0 || (args.strict && warningCount > 0) ? 1 : 0);

function parseArgs(argv) {
  const parsed = {
    root: '',
    strict: false,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') parsed.help = true;
    else if (arg === '--strict') parsed.strict = true;
    else if (arg === '--json') parsed.json = true;
    else if (arg === '--root') parsed.root = argv[++index] || '';
    else if (arg.startsWith('--root=')) parsed.root = arg.slice('--root='.length);
  }

  return parsed;
}

function printHelp() {
  console.log(`知识库 Lint

用法：
  npm run lint:knowledge
  npm run lint:knowledge -- --root ./knowledge --strict

检查范围：
  - 页面属性：是否有“页面属性 / 平台属性”和核心字段
  - 来源：正式 wiki 页面是否保留 raw 来源或参考资料
  - 双向链接：检查失效链接、孤立页面和推荐反链
  - 命名规范：检查目录、文件名、重复标题和不推荐字符

参数：
  --root <path>  指定知识库根目录，默认读取 KNOWLEDGE_ROOT 或 ./knowledge
  --strict       将警告也视为失败
  --json         输出 JSON 报告
`);
}

function walkMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) return [fullPath];
    return [];
  });
}

function readPage(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const body = parsed.content.trim();
  const relativePath = toPosix(path.relative(rootDir, filePath));
  const wikiPath = toPosix(path.relative(wikiDir, filePath));
  const section = wikiPath.split('/')[0] || '';
  const title = getTitle(body, filePath);
  const attributes = {
    ...Object.fromEntries(Object.entries(parsed.data).map(([key, value]) => [key, String(value ?? '').trim()])),
    ...parseAttributes(body),
  };

  return {
    filePath,
    relativePath,
    wikiPath,
    section,
    title,
    body,
    attributes,
    links: extractWikiLinks(body),
    sourceLinks: extractSourceLinks(body),
    hasPropertySection: hasAnySection(body, PROPERTY_HEADINGS),
    hasSourceSection: hasAnySection(body, SOURCE_HEADINGS),
  };
}

function getTitle(body, filePath) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(filePath, '.md');
}

function parseAttributes(body) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => {
    const heading = line.match(/^##\s+(.+?)\s*$/)?.[1]?.trim();
    return heading && PROPERTY_HEADINGS.has(heading);
  });
  if (start === -1) return {};

  const attributes = {};
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^##\s+/.test(line)) break;
    const match = line.match(/^-\s*([^：:]+)[：:]\s*(.*)$/);
    if (match) attributes[match[1].trim()] = stripWikiSyntax(match[2].trim());
  }
  return attributes;
}

function extractWikiLinks(body) {
  const links = [];
  const lines = body.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (const match of line.matchAll(/\[\[([^\]]+)\]\]/g)) {
      const [target, label] = match[1].split('|');
      links.push({
        raw: match[0],
        target: cleanLinkTarget(target),
        label: (label || target).trim(),
        line: lineIndex + 1,
      });
    }
  }
  return links;
}

function extractSourceLinks(body) {
  return getSections(body, SOURCE_HEADINGS)
    .flatMap((section) => extractWikiLinks(section.text))
    .filter((link) => normalizeTarget(link.target).startsWith('raw/'));
}

function getSections(body, headingSet) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  let active = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/)?.[1]?.trim();
    if (heading) {
      if (active) sections.push(active);
      active = headingSet.has(heading) ? { heading, text: '' } : null;
      continue;
    }
    if (active) active.text += `${line}\n`;
  }

  if (active) sections.push(active);
  return sections;
}

function hasAnySection(body, headingSet) {
  return body.split(/\r?\n/).some((line) => {
    const heading = line.match(/^##\s+(.+?)\s*$/)?.[1]?.trim();
    return heading && headingSet.has(heading);
  });
}

function buildPageIndex(allPages) {
  const index = new Map();
  for (const page of allPages) {
    for (const key of getPageKeys(page)) {
      const normalized = normalizeTarget(key);
      if (!index.has(normalized)) index.set(normalized, page);
    }
  }
  return index;
}

function getPageKeys(page) {
  const relativeWithoutMd = stripMarkdown(page.relativePath);
  const wikiWithoutMd = stripMarkdown(page.wikiPath);
  return [
    page.relativePath,
    relativeWithoutMd,
    page.wikiPath,
    wikiWithoutMd,
    `wiki/${page.wikiPath}`,
    `wiki/${wikiWithoutMd}`,
    path.posix.basename(wikiWithoutMd),
    page.title,
  ];
}

function checkDuplicateTitles(allPages) {
  const byTitle = new Map();
  const bySlug = new Map();

  for (const page of allPages) {
    pushMap(byTitle, normalizeTarget(page.title).toLowerCase(), page);
    pushMap(bySlug, normalizeTarget(stripMarkdown(page.relativePath)).toLowerCase(), page);
  }

  for (const group of byTitle.values()) {
    if (group.length > 1) {
      addFinding('warn', 'duplicate-title', group[0].filePath, `标题重复：${group.map((page) => page.relativePath).join('、')}`);
    }
  }

  for (const group of bySlug.values()) {
    if (group.length > 1) {
      addFinding('error', 'duplicate-path', group[0].filePath, `路径大小写归一后重复：${group.map((page) => page.relativePath).join('、')}`);
    }
  }
}

function checkLocation(page) {
  if (!ALLOWED_WIKI_DIRS.has(page.section)) {
    addFinding('error', 'wiki-location', page.filePath, `wiki 页面应放在固定目录中，当前目录是 ${page.section || '(根目录)'}`);
  }
}

function checkNaming(page) {
  const fileName = path.basename(page.filePath);
  const baseName = path.basename(page.filePath, '.md');
  const recommendedPattern = /^[\p{Letter}\p{Number}\p{Script=Han}_().（）#+-]+\.md$/u;

  if (fileName !== fileName.trim()) {
    addFinding('error', 'file-name', page.filePath, '文件名前后不应有空格。');
  }
  if (/[<>:"|?*]/.test(fileName)) {
    addFinding('error', 'file-name', page.filePath, '文件名包含 Windows / GitHub 不友好的字符。');
  }
  if (/\s/.test(fileName)) {
    addFinding('warn', 'file-name', page.filePath, '文件名中有空格，建议改用下划线，方便链接和脚本处理。');
  }
  if (!recommendedPattern.test(fileName)) {
    addFinding('warn', 'file-name', page.filePath, '文件名不符合推荐字符集：中文、英文、数字、下划线、短横线、括号。');
  }
  if (!page.body.match(/^#\s+(.+)$/m)) {
    addFinding('warn', 'title', page.filePath, '页面缺少一级标题，网页会退回使用文件名。');
  }
  if (page.section === 'modules' && page.attributes['类型']?.includes('平台') && !baseName.includes('_')) {
    addFinding('warn', 'file-name', page.filePath, '平台模块页建议使用“平台_模块.md”格式。');
  }
}

function checkProperties(page) {
  if (!page.hasPropertySection) {
    addFinding('error', 'page-properties', page.filePath, '缺少“## 页面属性”或“## 平台属性”。');
    return;
  }

  const type = page.attributes['类型'];
  if (!type) {
    addFinding('error', 'page-properties', page.filePath, '页面属性缺少“类型”。');
  }

  const hint = TYPE_HINTS[page.section];
  if (type && hint && !hint.test(type)) {
    addFinding('warn', 'page-properties', page.filePath, `类型“${type}”与目录 wiki/${page.section}/ 不够一致。`);
  }

  const recommended = getRecommendedAttributes(page.section);
  for (const key of recommended) {
    if (!page.attributes[key]) {
      addFinding('warn', 'page-properties', page.filePath, `建议补充页面属性“${key}”。`);
    }
  }
}

function getRecommendedAttributes(section) {
  switch (section) {
    case 'indexes':
      return ['类型'];
    case 'platforms':
      return ['主类型', '厂家', '平台', '场景', '适用范围'];
    case 'modules':
      return ['平台', '模块', '场景', '适用范围'];
    case 'issues':
      return ['平台', '模块', '场景', '适用范围'];
    case 'workflows':
      return ['平台', '场景', '适用范围'];
    case 'tools':
      return ['平台', '场景', '适用范围'];
    case 'cases':
      return ['平台', '场景', '适用范围'];
    default:
      return ['场景', '适用范围'];
  }
}

function checkSources(page) {
  if (page.section === 'indexes') return;

  const rawLinks = page.links.filter((link) => normalizeTarget(link.target).startsWith('raw/'));
  if (!page.hasSourceSection) {
    addFinding('warn', 'sources', page.filePath, '缺少“## 来源 / 已有原始资料 / 资料来源”小节。');
    return;
  }
  if (!page.sourceLinks.length && !rawLinks.length) {
    addFinding('warn', 'sources', page.filePath, '来源小节中没有 raw/ 引用；重要结论建议能追溯到原始资料或案例。');
  }
}

function checkLinks(page, index) {
  for (const link of page.links) {
    const normalized = normalizeTarget(link.target);
    if (!normalized || normalized.startsWith('raw/') || normalized.startsWith('schema/') || normalized.startsWith('logs/')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(normalized)) continue;

    const targetPage = resolveLink(link.target, index);
    if (!targetPage) {
      addFinding('error', 'links', page.filePath, `第 ${link.line} 行链接无法解析：${link.raw}`);
    }
  }
}

function checkLinkCoverage(allPages, index) {
  for (const page of allPages) {
    if (page.section === 'indexes') continue;

    const outgoing = page.links
      .map((link) => resolveLink(link.target, index))
      .some((target) => target && target.relativePath !== page.relativePath && target.section !== 'indexes');
    const incoming = allPages.some((source) => source.section !== 'indexes' && source.links.some((link) => {
      const target = resolveLink(link.target, index);
      return target?.relativePath === page.relativePath && source.relativePath !== page.relativePath;
    }));

    if (!outgoing && !incoming) {
      addFinding('warn', 'isolated-page', page.filePath, '页面没有可解析的入链或出链，建议接入索引、平台页或相关问题页。');
    } else if (!incoming) {
      addFinding('warn', 'backlinks', page.filePath, '没有其他正式页面链接到本页，建议补一个回链入口。');
    } else if (!outgoing) {
      addFinding('warn', 'links', page.filePath, '本页没有链接到其他正式页面，建议补充相关页面入口。');
    }
  }
}

function resolveLink(target, index) {
  const normalized = normalizeTarget(target);
  const withoutMd = stripMarkdown(normalized);
  const candidates = [
    normalized,
    withoutMd,
    `wiki/${normalized}`,
    `wiki/${withoutMd}`,
    path.posix.basename(withoutMd),
  ];
  for (const candidate of candidates) {
    const page = index.get(normalizeTarget(candidate));
    if (page) return page;
  }
  return undefined;
}

function cleanLinkTarget(target) {
  return target.trim().replace(/#[^#]*$/, '');
}

function stripMarkdown(value) {
  return normalizeTarget(value).replace(/\.md$/i, '');
}

function normalizeTarget(value) {
  return toPosix(String(value || ''))
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/#[^#]*$/, '')
    .trim();
}

function stripWikiSyntax(value) {
  return value.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => label || target);
}

function toPosix(value) {
  return value.replaceAll('\\', '/');
}

function pushMap(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function addFinding(level, rule, filePath, message) {
  findings.push({
    level,
    rule,
    file: toPosix(path.relative(process.cwd(), filePath)),
    message,
  });
}

function printReport(allPages, allFindings, options) {
  const errorCount = allFindings.filter((finding) => finding.level === 'error').length;
  const warningCount = allFindings.filter((finding) => finding.level === 'warn').length;

  if (options.json) {
    console.log(JSON.stringify({
      root: toPosix(rootDir),
      pages: allPages.length,
      errors: errorCount,
      warnings: warningCount,
      findings: allFindings,
    }, null, 2));
    return;
  }

  console.log(`知识库 Lint：${allPages.length} 个页面，${errorCount} 个错误，${warningCount} 个警告。`);
  if (!allFindings.length) {
    console.log('通过：页面属性、来源、链接和命名规范未发现问题。');
    return;
  }

  for (const level of ['error', 'warn']) {
    const group = allFindings.filter((finding) => finding.level === level);
    if (!group.length) continue;
    console.log('');
    console.log(level === 'error' ? '错误' : '警告');
    for (const finding of group) {
      console.log(`- [${finding.rule}] ${finding.file}: ${finding.message}`);
    }
  }

  if (warningCount && !options.strict) {
    console.log('');
    console.log('提示：默认只有错误会让命令失败；加 --strict 可以把警告也作为失败。');
  }
}
