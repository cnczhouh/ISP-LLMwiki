import fs, { type Dirent } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PageKind =
  | 'indexes'
  | 'platforms'
  | 'modules'
  | 'issues'
  | 'workflows'
  | 'tools'
  | 'cases'
  | 'logs'
  | 'other';

export interface KnowledgePage {
  filePath: string;
  relativePath: string;
  slug: string;
  url: string;
  kind: PageKind;
  title: string;
  description: string;
  body: string;
  rawBody: string;
  attributes: Record<string, string>;
  links: WikiLink[];
  sources: WikiLink[];
  updatedAt: number;
  updatedAtLabel: string;
}

export interface WikiLink {
  raw: string;
  target: string;
  label: string;
}

export interface RawAsset {
  filePath: string;
  relativePath: string;
  slug: string;
  url: string;
  fileName: string;
}

const configuredRoot = process.env.KNOWLEDGE_ROOT?.trim();
const bundledRoot = path.resolve(process.cwd(), 'knowledge');
const siblingRoot = path.resolve(process.cwd(), '..', 'Own');
const rootDir = configuredRoot
  ? path.resolve(configuredRoot)
  : fs.existsSync(path.join(bundledRoot, 'wiki'))
    ? bundledRoot
    : siblingRoot;
const wikiDir = path.join(rootDir, 'wiki');
const logsDir = path.join(rootDir, 'logs');
const rawDir = path.join(rootDir, 'raw');

let pageCache: KnowledgePage[] | undefined;
let indexCache: Map<string, KnowledgePage> | undefined;
let rawCache: RawAsset[] | undefined;

export function getKnowledgePages(): KnowledgePage[] {
  const refreshForDev = Boolean(import.meta.env?.DEV);
  if (pageCache && !refreshForDev) return pageCache;

  const contentDirs = [wikiDir, logsDir].filter((dir) => fs.existsSync(dir));

  if (!contentDirs.length) {
    pageCache = [];
    indexCache = buildPageIndex(pageCache);
    return pageCache;
  }

  const files = contentDirs.flatMap(walkMarkdownFiles);
  pageCache = files.map(readKnowledgePage).sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
  indexCache = buildPageIndex(pageCache);
  return pageCache;
}

export function getPageIndex(): Map<string, KnowledgePage> {
  if (!indexCache) indexCache = buildPageIndex(getKnowledgePages());
  return indexCache;
}

export function getPageBySlug(slug: string): KnowledgePage | undefined {
  return getKnowledgePages().find((page) => page.slug === slug);
}

export function getPagesByKind(kind: PageKind): KnowledgePage[] {
  return getKnowledgePages().filter((page) => page.kind === kind);
}

export function getBacklinks(page: KnowledgePage): KnowledgePage[] {
  const pages = getKnowledgePages();
  const candidates = new Set([page.relativePath, stripMarkdown(page.relativePath), page.title, path.basename(page.relativePath, '.md')]);

  return pages
    .filter((source) => source.relativePath !== page.relativePath)
    .filter((source) => source.links.some((link) => candidates.has(normalizeTarget(link.target)) || resolveWikiLink(link)?.relativePath === page.relativePath))
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
}

export function getRawAssets(): RawAsset[] {
  const refreshForDev = Boolean(import.meta.env?.DEV);
  if (rawCache && !refreshForDev) return rawCache;

  if (!fs.existsSync(rawDir)) {
    rawCache = [];
    return rawCache;
  }

  rawCache = walkFiles(rawDir)
    .filter(isPublicRawAsset)
    .map((filePath) => {
      const relativePath = toPosix(path.relative(rootDir, filePath));
      const slug = relativePath;
      return {
        filePath,
        relativePath,
        slug,
        url: toRawUrl(slug),
        fileName: path.basename(filePath),
      };
    })
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath, 'zh-Hans-CN'));

  return rawCache;
}

function isPublicRawAsset(filePath: string): boolean {
  return path.extname(filePath).toLowerCase() === '.pdf';
}

export function resolveRawAsset(target: string): RawAsset | undefined {
  const normalized = normalizeTarget(target);
  if (!normalized.startsWith('raw/')) return undefined;
  return getRawAssets().find((asset) => normalizeTarget(asset.relativePath) === normalized);
}

export function resolveWikiLink(link: WikiLink): KnowledgePage | undefined {
  const index = getPageIndex();
  const target = normalizeTarget(link.target);
  return index.get(target) ?? index.get(stripMarkdown(target)) ?? index.get(`wiki/${stripMarkdown(target)}`) ?? index.get(path.basename(stripMarkdown(target)));
}

export function resolveTarget(target: string): KnowledgePage | undefined {
  return resolveWikiLink({ raw: target, target, label: target });
}

export function toSiteUrl(page: KnowledgePage): string {
  return page.url;
}

export function createSearchItems() {
  return getKnowledgePages()
    .filter((page) => page.kind !== 'logs' && page.title !== '知识库维护索引')
    .map((page) => ({
      title: page.title,
      description: page.description,
      url: page.url,
      kind: page.kind,
      path: page.relativePath,
      updatedAt: page.updatedAt,
      text: `${page.title} ${page.description} ${Object.values(page.attributes).join(' ')} ${page.rawBody}`.replace(/\s+/g, ' ').slice(0, 5000),
    }));
}

function readKnowledgePage(filePath: string): KnowledgePage {
  const stat = fs.statSync(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const relativePath = toPosix(path.relative(rootDir, filePath));
  const slug = stripMarkdown(relativePath);
  const body = parsed.content.trim();
  const title = getTitle(body, filePath);
  const attributes = parseAttributes(body);
  const links = extractWikiLinks(body);
  const sources = links.filter((link) => normalizeTarget(link.target).startsWith('raw/'));
  const description = getDescription(body, attributes);

  return {
    filePath,
    relativePath,
    slug,
    url: toPageUrl(slug),
    kind: getKind(relativePath),
    title,
    description,
    body,
    rawBody: body,
    attributes: { ...Object.fromEntries(Object.entries(parsed.data).map(([key, value]) => [key, String(value)])), ...attributes },
    links,
    sources,
    updatedAt: stat.mtimeMs,
    updatedAtLabel: formatDate(stat.mtime),
  };
}

function walkFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry: Dirent) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    if (entry.isFile()) return [fullPath];
    return [];
  });
}

function walkMarkdownFiles(dir: string): string[] {
  return walkFiles(dir).filter((filePath) => filePath.endsWith('.md'));
}

function getTitle(body: string, filePath: string): string {
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || path.basename(filePath, '.md');
}

function getDescription(body: string, attributes: Record<string, string>): string {
  const fromAttribute = attributes['一句话定义'] || attributes['描述'] || attributes['场景'];
  if (fromAttribute) return fromAttribute;

  return body
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('|')) ?? '';
}

function parseAttributes(body: string): Record<string, string> {
  const lines = body.split('\n');
  const start = lines.findIndex((line) => /^##\s+(页面属性|平台属性)/.test(line.trim()));
  if (start === -1) return {};

  const attributes: Record<string, string> = {};
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) break;
    const match = line.match(/^-\s*([^：:]+)[：:]\s*(.+)$/);
    if (match) attributes[match[1].trim()] = stripWikiSyntax(match[2].trim());
  }
  return attributes;
}

function extractWikiLinks(body: string): WikiLink[] {
  const links: WikiLink[] = [];
  for (const match of body.matchAll(/\[\[([^\]]+)\]\]/g)) {
    const raw = match[0];
    const [target, label] = match[1].split('|');
    links.push({ raw, target: target.trim(), label: (label || target).trim() });
  }
  return links;
}

function buildPageIndex(pages: KnowledgePage[]): Map<string, KnowledgePage> {
  const index = new Map<string, KnowledgePage>();
  for (const page of pages) {
    const withoutMd = stripMarkdown(page.relativePath);
    const basename = path.posix.basename(withoutMd);
    const keys = [page.relativePath, withoutMd, basename, page.title];
    for (const key of keys) index.set(normalizeTarget(key), page);
  }
  return index;
}

function getKind(relativePath: string): PageKind {
  const parts = relativePath.split('/');
  if (parts[0] === 'logs') return 'logs';

  const section = parts[1];
  if (['indexes', 'platforms', 'modules', 'issues', 'workflows', 'tools', 'cases'].includes(section)) return section as PageKind;
  return 'other';
}


function toPageUrl(slug: string): string {
  return `/knowledge/${slug.split('/').map(encodePathSegment).join('/')}/`;
}

function toRawUrl(slug: string): string {
  return `/knowledge-files/${slug.split('/').map(encodePathSegment).join('/')}`;
}

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function stripMarkdown(value: string): string {
  return normalizeTarget(value).replace(/\.md$/i, '');
}

function normalizeTarget(value: string): string {
  return toPosix(value).replace(/^\.\//, '').replace(/^\/+/, '').trim();
}

function stripWikiSyntax(value: string): string {
  return value.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => label || target);
}

function toPosix(value: string): string {
  return value.replaceAll('\\', '/');
}



