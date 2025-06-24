// Type declarations for Storybook
import type { StoryContext, ReactRenderer } from '@storybook/react';

// Export common Storybook types for convenience
export type {
  StoryContext,
  ReactRenderer,
  Decorator,
  StoryFn,
  StoryObj,
  Meta,
} from '@storybook/react';

// Type for theme provider
export type WithThemeProvider = (story: () => React.ReactNode) => React.ReactNode;

// Type for docs components
export type DocsComponents = {
  DocsPage: React.ComponentType;
  DocsContainer: React.ComponentType<{ context: unknown }>;
};

// Global window extension for Storybook
declare global {
  interface Window {
    __STORYBOOK_ADDONS_CHANNEL__: unknown;
  }
}

// Declare global types for Storybook
declare const withThemeProvider: WithThemeProvider;
declare const DocsPage: DocsComponents['DocsPage'];
declare const DocsContainer: DocsComponents['DocsContainer'];
