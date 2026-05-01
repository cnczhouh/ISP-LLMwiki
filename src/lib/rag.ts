import type { KnowledgePage, PageKind } from './content';
import { getKnowledgePages } from './content';
import { getPageModuleName, getPagePlatform, kindLabels } from './taxonomy';

export interface RagChunk {
  id: string;
  pageTitle: string;
  pageUrl: string;
  pageKind: PageKind;
  kindLabel: string;
  platform: string;
  module: string;
  section: string;
  sourcePath: string;
  text: string;
  searchText: string;
}

interface SectionBlock {
  heading: string;
  text: string;
}

const maxChunkLength = 900;
const chunkOverlap = 140;

export function createRagChunks(): RagChunk[] {
  return getKnowledgePages()
    .filter((page) => page.relativePath.startsWith('wiki/') && page.title !== '知识库维护索引')
    .flatMap(pageToChunks);
}

function pageToChunks(page: KnowledgePage): RagChunk[] {
  const platform = getPagePlatform(page);
  const module = getPageModuleName(page);
  const blocks = splitIntoSections(stripInternalSections(page.body));

  return blocks.flatMap((block, blockIndex) => {
    const parts = splitLongText(block.text || page.description || page.title);
    return parts.map((text, partIndex) => {
      const section = block.heading || page.title;
      const sourcePath = `${page.relativePath}${section ? `#${section}` : ''}`;
      const searchText = [
        page.title,
        kindLabels[page.kind],
        platform,
        module,
        section,
        page.description,
        sourcePath,
        Object.values(page.attributes).join(' '),
        text,
      ]
        .join(' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();

      return {
        id: `${page.slug}::${blockIndex}::${partIndex}`,
        pageTitle: page.title,
        pageUrl: page.url,
        pageKind: page.kind,
        kindLabel: kindLabels[page.kind],
        platform,
        module,
        section,
        sourcePath,
        text,
        searchText,
      };
    });
  });
}

function splitIntoSections(markdown: string): SectionBlock[] {
  const lines = markdown.split('\n');
  const sections: SectionBlock[] = [];
  let heading = '';
  let buffer: string[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (match) {
      pushSection(sections, heading, buffer);
      heading = cleanMarkdown(match[2]);
      buffer = [];
      continue;
    }
    buffer.push(line);
  }

  pushSection(sections, heading, buffer);
  return sections.length ? sections : [{ heading: '', text: cleanMarkdown(markdown) }];
}

function pushSection(sections: SectionBlock[], heading: string, buffer: string[]) {
  const text = cleanMarkdown(buffer.join('\n'));
  if (!text && !heading) return;
  sections.push({ heading, text });
}

function splitLongText(text: string): string[] {
  const paragraphs = text
    .split(/\n{2,}|(?<=。|！|？|；)\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    if (`${current}\n${paragraph}`.length <= maxChunkLength) {
      current = `${current}\n${paragraph}`;
      continue;
    }

    chunks.push(current);
    current = current.slice(Math.max(0, current.length - chunkOverlap)).trimStart();
    current = current ? `${current}\n${paragraph}` : paragraph;
  }

  if (current) chunks.push(current);
  return chunks.flatMap((chunk) => splitOversizedChunk(chunk));
}

function splitOversizedChunk(text: string): string[] {
  if (text.length <= maxChunkLength) return [text];

  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += maxChunkLength - chunkOverlap) {
    chunks.push(text.slice(index, index + maxChunkLength).trim());
  }
  return chunks.filter(Boolean);
}

function stripInternalSections(markdown: string): string {
  const lines = markdown.split('\n');
  const visible: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (/^##\s+(页面属性|平台属性|待补充)\s*$/.test(lines[index].trim())) {
      index += 1;
      while (index < lines.length && !/^##\s+/.test(lines[index].trim())) {
        index += 1;
      }
      index -= 1;
      continue;
    }
    if (/^\s*-\s*`?schema\//.test(lines[index])) continue;
    if (/^\s*-\s*新建或整理页面时/.test(lines[index])) continue;
    visible.push(lines[index]);
  }

  return visible.join('\n').trim();
}

function cleanMarkdown(value: string): string {
  return value
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => label || target.split('/').pop())
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/[*_~>#|]/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
