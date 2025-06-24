import { defineConfig, type PluginOption, type Plugin, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';

// Plugin to strip 'use client' directives
function stripUseClientPlugin(): Plugin {
  return {
    name: 'strip-use-client',
    transform(code: string) {
      // Remove 'use client' directive from code
      if (code.includes('"use client"') || code.includes("'use client'")) {
        return code.replace(/"use client";?/g, '').replace(/'use client';?/g, '');
      }
      return code;
    }
  };
}

// Plugin to handle HMR for specific files
function handleHmrForFiles() {
  const filesToDisableHmr = [
    'ImageBlock.tsx',
    'ImageBlock.simple.test.tsx',
    'ImageBlock.test.tsx',
    'ImageBlock.new.test.tsx'
  ];

  return {
    name: 'handle-hmr-for-files',
    transform(code: string, id: string) {
      // Check if the current file is in our list of files to handle
      const shouldDisableHmr = filesToDisableHmr.some(file => id.includes(file));
      
      if (shouldDisableHmr) {
        // Add Vite HMR disable comment at the top of the file
        return {
          code: `// @vite-disable-hmr\n${code}`,
          map: null // No source map needed for this simple transformation
        };
      }
      return code;
    }
  };
}

// Type for Storybook module mapping
type StorybookModuleMap = {
  [key: string]: string | false;
};

// Plugin to handle Storybook internal modules
function storybookModuleFix(): Plugin {
  // Map of module names to their actual paths or false to mark as external
  const moduleMap: StorybookModuleMap = {
    // Core Storybook modules
    'storybook/internal/client-logger': '@storybook/core-client/dist/esm/logger',
    'storybook/internal/core-events': '@storybook/core-events',
    'storybook/internal/preview-api': '@storybook/preview-api/dist/preview-api',
    'storybook/internal/components': '@storybook/components',
    'storybook/manager-api': '@storybook/manager-api',
    'storybook/theming': '@storybook/theming',
    'storybook/highlight': '@storybook/highlight',
    
    // @storybook/* packages
    '@storybook/icons': '@storybook/icons',
    
    // Add any additional Storybook modules that need to be resolved
    'storybook': '@storybook/manager-api',
    'storybook/addons': '@storybook/manager-api',
    'storybook/channel-postmessage': '@storybook/channel-postmessage',
    'storybook/channel-websocket': '@storybook/channel-websocket',
    'storybook/channels': '@storybook/channels',
    'storybook/client-api': '@storybook/client-api',
    'storybook/client-logger': '@storybook/client-logger',
    'storybook/core-client': '@storybook/core-client',
    'storybook/csf': '@storybook/csf',
    'storybook/docs-tools': '@storybook/docs-tools',
    'storybook/preview-web': '@storybook/preview-web',
  };

  return {
    name: 'storybook-module-fix',
    config() {
      // Filter out any false values from module map values
      const validIncludes = Object.values(moduleMap).filter((v): v is string => Boolean(v));
      
      return {
        optimizeDeps: {
          // Ensure these modules are pre-bundled
          include: validIncludes,
        },
        ssr: {
          // Mark these modules as external for SSR
          external: Object.keys(moduleMap),
        },
      } as const;
    },
    resolveId(source: string) {
      // Handle the module resolution for Storybook internals
      const mappedSource = moduleMap[source as keyof typeof moduleMap];
      
      if (mappedSource === false) {
        // Mark as external without remapping
        return { id: source, external: true };
      }
      
      if (mappedSource) {
        // Remap to the specified module ID and mark as external
        return { 
          id: mappedSource, 
          external: true 
        };
      }
      
      // For any storybook/* modules not explicitly handled, mark as external
      if (source.startsWith('storybook/')) {
        console.warn(`Unhandled Storybook module: ${source}. Marking as external.`);
        return { id: source, external: true };
      }
      
      return null;
    },
  };
}

// Create the config with proper typing
export default defineConfig(({ mode }) => {
  const isStorybook = process.env.STORYBOOK === 'true';
  const isTest = mode === 'test';
  const isProduction = mode === 'production';

  // Initialize plugins array
  const plugins: PluginOption[] = [
    // Add React plugin with Babel configuration
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { 
            runtime: 'automatic',
            importSource: '@emotion/react' 
          }],
          '@emotion/babel-plugin',
        ],
      },
    }),

    // Only include storybook module fix when running storybook
    ...(isStorybook ? [storybookModuleFix()] : []),
    
    // Only include these plugins for non-test environments
    ...(isTest ? [] : [
      stripUseClientPlugin(),
      handleHmrForFiles(),
    ]),
  ];

  // Add tsconfigPaths if not in production
  if (!isProduction) {
    plugins.push(tsconfigPaths());
  }

  const baseConfig: UserConfig = {
    plugins,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        },
        {
          find: /^@vibing-ai\/block-kit$/,
          replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url))
        },
        {
          find: /^@vibing-ai\/block-kit\/(.*)/,
          replacement: fileURLToPath(new URL('./src/$1', import.meta.url))
        }
      ]
    },
    define: {
      'process.env': {}
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion',
        'lucide-react',
        '@vibing-ai/block-kit'
      ],
      exclude: [
        '**/dist/**',
        '**/node_modules/**'
      ]
    },
    server: {
      port: 3000,
      open: !isStorybook,
      hmr: {
        overlay: !isStorybook
      }
    },
    preview: {
      port: 3000,
      open: !isStorybook
    }
  };

  // Add build configuration for non-Storybook and non-test environments
  if (!isStorybook && !isTest) {
    return {
      ...baseConfig,
      build: {
        lib: {
          entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
          name: 'VibingBlockKit',
          fileName: (format: string) => `index.${format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        },
        sourcemap: !isProduction,
        minify: isProduction ? 'esbuild' : false
      }
    };
  }

  // Add test configuration for test environment
  if (isTest) {
    return {
      ...baseConfig,
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: [
          'node_modules',
          'dist',
          '.idea',
          '.git',
          '**/dist/**',
          '**/node_modules/**'
        ],
        coverage: {
          reporter: ['text', 'json', 'html']
        }
      }
    };
  }

  return baseConfig;
});