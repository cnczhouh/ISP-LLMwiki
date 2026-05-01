import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { getRawAssets, type RawAsset } from '../../lib/content';

export const prerender = true;

export function getStaticPaths() {
  return getRawAssets().map((asset) => ({
    params: { path: asset.slug },
    props: { asset },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const asset = props.asset as RawAsset;
  const file = fs.readFileSync(asset.filePath);
  const body = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;

  return new Response(body, {
    headers: {
      'Content-Type': getMimeType(asset.fileName),
      'Content-Length': String(file.byteLength),
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(asset.fileName)}`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

function getMimeType(fileName: string): string {
  switch (path.extname(fileName).toLowerCase()) {
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.md':
      return 'text/markdown; charset=utf-8';
    case '.json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}
