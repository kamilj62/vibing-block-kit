import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-styling';
// Temporarily disable withTests until we have test results
// import { withTests } from '@storybook/addon-jest';
// import { withA11y } from '@storybook/addon-a11y';

// Import global styles if needed
// import '../src/styles/globals.css';

// Import decorators
import withProviders from './decorators/withProviders';

// Import test results
// import results from '../.jest-test-results.json';

// Configure viewports
const viewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1280px',
      height: '800px',
    },
  },
  large: {
    name: 'Large',
    styles: {
      width: '1920px',
      height: '1080px',
    },
  },
};

// Configure backgrounds
const backgrounds = {
  default: 'light',
  values: [
    { name: 'light', value: '#ffffff' },
    { name: 'dark', value: '#1a202c' },
    { name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998' },
  ],
};

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  parameters: {
    // Actions addon configuration
    actions: { 
      argTypesRegex: '^on[A-Z].*',
      handles: ['click', 'mouseover', 'focus', 'keydown', 'submit'],
    },
    
    // Controls addon configuration
    controls: {
      matchers: {
        color: /(background|color|fill|stroke)$/i,
        date: /Date$/,
      },
      expanded: true,
      sort: 'requiredFirst',
      hideNoControlsWarning: true,
    },

    // Viewport configuration
    viewport: {
      viewports,
      defaultViewport: 'responsive',
    },

    // Backgrounds configuration
    backgrounds,

    // Layout configuration
    layout: 'centered',
    
    // Docs configuration
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      toc: {
        headingSelector: 'h2, h3',
        title: 'Table of Contents',
      },
    },

    // A11y addon configuration
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },

    // Test results for addon-jest
    // jest: ['button', 'input'],
  },

  // Global decorators
  decorators: [
    withProviders,
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    // Temporarily disabled until we have test results
    // withTests({
    //   results,
    //   filesExt: '((\\.specs?)|(\\.tests?))?(\\.(jsx?|tsx?))?$',
    // }),
  ],

  // Global types
  argTypes: {
    // Common props
    className: {
      table: {
        category: 'Common',
      },
    },
    style: {
      table: {
        category: 'Common',
      },
    },
    // Disable controls for common props that shouldn't be set via controls
    children: {
      table: {
        disable: true,
      },
    },
    // Common event handlers
    onClick: {
      table: {
        category: 'Events',
      },
    },
    onChange: {
      table: {
        category: 'Events',
      },
    },
    onFocus: {
      table: {
        category: 'Events',
      },
    },
    onBlur: {
      table: {
        category: 'Events',
      },
    },
    onKeyDown: {
      table: {
        category: 'Events',
      },
    },
    onKeyUp: {
      table: {
        category: 'Events',
      },
    },
  },
};

export default preview;
