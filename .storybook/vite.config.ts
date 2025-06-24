import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Vite config for Storybook
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    // Enable tsconfig paths resolution
    tsconfigPaths({
      root: resolve(__dirname, '..'),
      projects: [resolve(__dirname, '../tsconfig.json')],
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: '@vibing-ai/block-kit',
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
  },
  server: {
    port: 6006,
    strictPort: true,
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..']
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: false
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@emotion/react',
      '@emotion/styled',
      // Add other dependencies that might need to be optimized
    ]
  },
  define: {
    'process.env': {}
  }
});
