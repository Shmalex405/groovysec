import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/docs/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../client/public/docs',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['remark-gfm', 'mdast-util-gfm', 'micromark-extension-gfm'],
  },
});
