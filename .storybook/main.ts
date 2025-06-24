import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  // Story files location
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../docs/**/*.stories.mdx',
    '../docs/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  
  // Addons configuration
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false, // We'll handle backgrounds manually
        actions: true,
        controls: true,
        docs: true,
        viewport: true,
        toolbars: true,
        measure: true,
        outline: true,
      },
    },
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-styling',
  ],

  // Framework configuration
  framework: {
    name: '@storybook/react-vite',
    options: {
      strictMode: true,
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },

  // Core features
  core: {
    disableTelemetry: true, // Disables telemetry
    enableCrashReports: false, // Disables crash reporting
  },

  // Features configuration
  features: {
    storyStoreV7: true, // Use the new story store
    buildStoriesJson: true, // Generate stories.json for build
    // Note: breakingChangesV7 is not a valid feature in current Storybook version
  },

  // Static directories
  staticDirs: ['../public'],

  // TypeScript configuration - using project's tsconfig.json
  typescript: {
    check: false, // Disable type checking in Storybook for now
    skipBabel: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      shouldExtractValuesFromUnion: true,
      propFilter: (prop) => {
        // Filter out node_modules except @vibing-ai
        if (prop.parent) {
          return !/node_modules\/(?!@vibing-ai)/.test(prop.parent.fileName);
        }
        return true;
      },
      // Let it use the project's tsconfig.json
    },
  },

  // Vite configuration
  async viteFinal(config) {
    // Merge custom Vite config
    return mergeConfig(config, {
      // Customize the Vite config for Storybook
      plugins: [
        // Add tsconfig paths support
        tsconfigPaths({
          projects: ['../tsconfig.json'],
        }),
      ],
      // Shared Vite config
      resolve: {
        alias: {
          // Add any aliases here
        },
      },
      // Optimize deps for Storybook
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@emotion/react',
          '@emotion/styled',
        ],
        esbuildOptions: {
          // Target modern browsers
          target: 'es2020',
        },
      },
      // Build configuration for Storybook
      build: {
        target: 'es2020',
        sourcemap: true,
        minify: false, // Disable minification for better debugging
      },
      // Server configuration
      server: {
        fs: {
          // Allow serving files from one level up from the package root
          allow: ['..'],
        },
      },
    });
  },

  // Docs configuration
  docs: {
    autodocs: 'tag', // Generate docs automatically for stories with the 'docs' tag
    defaultName: 'Documentation', // Default tab name
  },

  // Logging level
  logLevel: 'debug',
};

export default config;
