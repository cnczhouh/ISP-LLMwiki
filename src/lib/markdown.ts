import { marked } from 'marked';
import { resolveRawAsset, resolveTarget } from './content';

marked.use({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(markdown: string): string {
  const visibleMarkdown = stripInternalSections(markdown);
  const normalizedMarkdown = visibleMarkdown.replace(/`\[\[raw\/([^\]]+)\]\]`/g, '[[$1]]');
  const withLinks = normalizedMarkdown.replace(/\[\[([^\]]+)\]\]/g, (_match, content: string) => {
    const [rawTarget, rawLabel] = content.split('|');
    const target = rawTarget.trim();
    const label = (rawLabel || rawTarget).trim();
    const page = resolveTarget(target);
    const rawAsset = resolveRawAsset(target);

    if (!page) {
      if (rawAsset) return `<a class="source-link" href="${escapeHtml(rawAsset.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(cleanRawLabel(label))}</a>`;
      if (target.startsWith('raw/')) return `<span class="source-ref">${escapeHtml(cleanRawLabel(label))}</span>`;
      if (target.startsWith('schema/')) return '';
      return `<span class="missing-link">${escapeHtml(label)}</span>`;
    }

    return `<a href="${escapeHtml(page.url)}">${escapeHtml(label)}</a>`;
  });

  return marked.parse(withLinks, { async: false }) as string;
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

function cleanRawLabel(value: string): string {
  return value.replace(/^raw\//, '');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
