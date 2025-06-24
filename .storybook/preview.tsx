import React from 'react';
import type { Preview } from '@storybook/react';

// Basic theme object
const theme = {
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    text: '#333333',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: 'inherit',
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: typeof theme;
}

// Simple theme provider
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme }) => {
  return (
    <div
      style={{
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {children}
    </div>
  );
};

// Global decorator for theming
const withThemeProvider = (Story, context) => {
  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
};

// Global decorators and parameters
const preview: Preview = {
  decorators: [
    withThemeProvider,
    (Story) => (
      <React.StrictMode>
        <Story />
      </React.StrictMode>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Components', 'Blocks', 'Surfaces', 'Hooks', 'Utils'],
      },
      panelPosition: 'right',
    },
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
    react: {
      version: 'detect',
      strictMode: true,
    },
    docs: {
      page: null,
    },
  },
  globalTypes: {
    // Add global types here if needed
  },
};

export default preview;
