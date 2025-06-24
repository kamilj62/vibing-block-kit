/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.storybook/**',
      '**/stories/**',
      '**/examples/**',
    ],
    typecheck: {
      tsconfig: 'tsconfig.test.json',
    },
    coverage: {
      enabled: true,
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.stories.{ts,tsx}',
        '**/__mocks__/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/__tests__/**',
      ],
    },
    deps: {
      // Enable module resolution for ESM packages
      interopDefault: true,
      // Inline small modules to avoid ESM issues
      inline: [
        'vite-tsconfig-paths',
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@vibing-ai/block-kit',
      ],
    },
    // Disable threads as they can cause issues with some ESM packages
    threads: false,
    testTimeout: 10000,
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
    },
  },
  resolve: {
    // Handle module resolution
    alias: [
      { find: 'react', replacement: 'react' },
      { find: 'react-dom', replacement: 'react-dom' },
    ],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  // Build configuration
  build: {
    target: 'esnext',
  },
});