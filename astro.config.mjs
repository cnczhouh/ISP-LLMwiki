import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const isStaticBuild = process.env.BUILD_MODE === 'static'
  || process.env.ASTRO_OUTPUT === 'static'
  || process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'ISP-LLMwiki';
const site = process.env.SITE || (isStaticBuild ? `https://${process.env.GITHUB_REPOSITORY_OWNER || 'cnczhouh'}.github.io` : undefined);
const base = isStaticBuild ? normalizeBase(process.env.BASE_PATH || `/${repoName}`) : '/';

export default defineConfig({
  ...(site ? { site } : {}),
  base,
  output: isStaticBuild ? 'static' : 'server',
  ...(isStaticBuild ? {} : {
    adapter: node({
      mode: 'standalone',
    }),
  }),
  vite: {
    cacheDir: '.astro/vite-cache-final',
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
    server: {
      allowedHosts: ['zhouhui.tail1dc8d0.ts.net'],
      fs: {
        allow: ['..'],
      },
    },
  },
});

function normalizeBase(value) {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}
