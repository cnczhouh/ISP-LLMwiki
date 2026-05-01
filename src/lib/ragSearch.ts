import type { RagChunk } from './rag';
import { createRagChunks } from './rag';

export interface RagSearchResult {
  chunk: RagChunk;
  score: number;
}

export interface RagSearchOptions {
  preferredKinds?: string[];
  kindBoost?: number;
}

const kindHints: Record<string, string[]> = {
  issues: ['问题', '现象', '排查', '原因', '怎么', '为什么', '异常', '过曝', '偏色', '噪声', '拖影', '闪烁'],
  modules: ['模块', '参数', '调整', '调试', '寄存器', '功能', '影响'],
  workflows: ['流程', '步骤', '顺序', '路线'],
  tools: ['工具', '软件', '导入', '导出', '连接'],
  platforms: ['平台', '芯片', 'sensor', 'isp'],
};

export function searchRagChunks(
  query: string,
  limit = 8,
  chunks = createRagChunks(),
  options: RagSearchOptions = {},
): RagSearchResult[] {
  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(query, chunk, options) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const pageCounts = new Map<string, number>();
  const selected: RagSearchResult[] = [];

  for (const item of ranked) {
    const count = pageCounts.get(item.chunk.pageUrl) || 0;
    if (count >= 2) continue;
    selected.push(item);
    pageCounts.set(item.chunk.pageUrl, count + 1);
    if (selected.length >= limit) break;
  }

  return selected;
}

export function buildModelContext(results: RagSearchResult[], maxChars = 9000): string {
  let context = '';

  for (const [index, { chunk }] of results.entries()) {
    const item = [
      `[${index + 1}] ${chunk.pageTitle}`,
      `页面: ${chunk.pageUrl}`,
      `章节: ${chunk.section || chunk.pageTitle}`,
      `类型: ${chunk.kindLabel}`,
      `平台: ${chunk.platform}`,
      `模块: ${chunk.module}`,
      `内容: ${chunk.text}`,
    ].join('\n');

    if (context && `${context}\n\n${item}`.length > maxChars) break;
    context = context ? `${context}\n\n${item}` : item;
  }

  return context;
}

function scoreChunk(query: string, chunk: RagChunk, options: RagSearchOptions): number {
  const normalizedQuery = normalize(query);
  const tokens = tokenize(query);
  if (!tokens.length) return 0;

  let score = 0;
  const title = normalize(chunk.pageTitle);
  const section = normalize(chunk.section);
  const platform = normalize(chunk.platform);
  const module = normalize(chunk.module);
  const source = normalize(chunk.sourcePath);
  const text = chunk.searchText || '';

  if (normalizedQuery && text.includes(normalizedQuery)) score += 80;
  if (normalizedQuery && title.includes(normalizedQuery)) score += 55;
  if (normalizedQuery && section.includes(normalizedQuery)) score += 40;

  for (const token of tokens) {
    if (title.includes(token)) score += 18;
    if (section.includes(token)) score += 14;
    if (platform.includes(token)) score += 20;
    if (module.includes(token)) score += 18;
    if (source.includes(token)) score += 10;
    if (text.includes(token)) score += 4;
  }

  for (const [kind, hints] of Object.entries(kindHints)) {
    if (chunk.pageKind !== kind) continue;
    if (hints.some((hint) => normalizedQuery.includes(hint))) score += 10;
  }

  if (chunk.pageKind === 'indexes') score -= 8;
  if (options.preferredKinds?.includes(chunk.pageKind)) score += options.kindBoost ?? 20;
  return score;
}

function normalize(value: string): string {
  return value
    .toString()
    .toLowerCase()
    .replace(/[，。！？；：、（）【】《》“”‘’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalize(value);
  const latin = normalized.match(/[a-z0-9_+#.-]{2,}/g) || [];
  const chineseTerms: string[] = [];

  for (const match of normalized.matchAll(/[\u4e00-\u9fff]{2,}/g)) {
    const text = match[0];
    if (text.length <= 8) chineseTerms.push(text);
    for (const size of [2, 3, 4]) {
      for (let index = 0; index <= text.length - size; index += 1) {
        chineseTerms.push(text.slice(index, index + size));
      }
    }
  }

  return [...new Set([...latin, ...chineseTerms])].filter((token) => token.length > 1);
}
