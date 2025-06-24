// Import test utilities
import '@testing-library/jest-dom/vitest';
import React from 'react';
import type { RenderResult, RenderOptions, Queries } from '@testing-library/react';

// Use global vi from Vitest
declare const vi: typeof import('vitest').vi;

// Extend the global type to include our test utilities
declare global {
  // Testing Library globals
  const render: <
    Q extends Queries = typeof import('@testing-library/dom').queries,
    Container extends Element | DocumentFragment = HTMLElement
  >(
    ui: React.ReactElement,
    options?: RenderOptions<Q, Container>
  ) => RenderResult<Q> & { container: Container };

  // Extend Window interface with test-related properties
  interface Window {
    __VITEST__: boolean;
    Image: new (width?: number, height?: number) => HTMLImageElement;
    matchMedia: (query: string) => MediaQueryList;
    scrollTo: {
      (options?: ScrollToOptions): void;
      (x: number, y: number): void;
    };
  }

  // Node.js globals
  interface ProcessEnv {
    NODE_ENV: 'test' | 'development' | 'production';
    VITEST: string;
  }
}

// Mock browser APIs
beforeAll(() => {
  // 1. Mock window.scrollTo with proper type signature
  window.scrollTo = vi.fn((..._args: [ScrollToOptions] | [number, number]) => {
    // Implementation can be empty as it's a mock
    // Using _args to indicate it's intentionally unused
  }) as Window['scrollTo'];

  // 2. Mock window.matchMedia
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // 3. Mock Image constructor
  const MockImage = class {
    onload: (() => void) | null = null;
    addEventListener = vi.fn((event: string, callback: () => void) => {
      if (event === 'load') {
        this.onload = callback;
      }
    });
    removeEventListener = vi.fn();
    dispatchEvent = vi.fn();
  };
  
  window.Image = MockImage as unknown as typeof Image;
});

// Mock @iconify/react
vi.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => {
    return React.createElement('span', {
      'data-testid': 'mock-icon',
      'data-icon': icon,
      role: 'img',
      'aria-label': (props as { 'aria-label'?: string })['aria-label'] || 'icon',
      ...props
    });
  },
}));

// Mock framer-motion
const createMotionComponent = <T extends keyof JSX.IntrinsicElements>(
  tagName: T,
  displayName: string
) => {
  const Component = React.forwardRef<HTMLElement, React.ComponentProps<T>>(
    (props, ref) => {
      const { children, ...rest } = props as React.PropsWithChildren<Record<string, unknown>>;
      return React.createElement(tagName, { ...rest, ref }, children);
    }
  );
  Component.displayName = displayName;
  return Component;
};

const motion = {
  div: createMotionComponent('div', 'motion.div'),
  img: createMotionComponent('img', 'motion.img'),
};

vi.mock('framer-motion', () => ({
  motion,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    set: vi.fn(),
    stop: vi.fn(),
  }),
  useInView: () => [vi.fn(), true],
  useReducedMotion: () => false,
}));

// Ensure React is available globally
if (!('React' in globalThis)) {
  (globalThis as { React: typeof React }).React = React;
}

// Reset all mocks before each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock implementation of matchMedia
const createMatchMedia = (matches = false): MediaQueryList => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn() as (event: Event) => boolean,
});

// Test utilities
export const testUtils = {
  mockMatchMedia: (matches = false) => createMatchMedia(matches)
};
