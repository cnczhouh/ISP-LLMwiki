import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
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
