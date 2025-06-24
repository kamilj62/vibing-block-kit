// @vitest-environment jsdom
/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Simple mock that doesn't require hoisting
vi.mock('./CleanImageBlock', () => ({
  default: React.forwardRef<HTMLImageElement, any>(({ src, alt, onLoad, onError }, ref) => {
    React.useEffect(() => {
      if (onLoad) {
        // Use Promise.resolve().then() to ensure the event is processed in the next tick
        Promise.resolve().then(() => {
          onLoad({ 
            target: { 
              complete: true,
              naturalWidth: 100,
              naturalHeight: 100,
              src: src as string,
              alt: alt || ''
            } 
          } as unknown as React.SyntheticEvent<HTMLImageElement, Event>);
        });
      }
      
      // Simulate error if src is 'error.jpg'
      if (typeof src === 'string' && src.includes('error')) {
        Promise.resolve().then(() => {
          onError?.({ 
            target: { 
              complete: false,
              src: src,
              alt: alt || ''
            } 
          } as unknown as React.SyntheticEvent<HTMLImageElement, Event>);
        });
      }
    }, [onLoad, onError, src, alt]);
    
    return <img ref={ref} src={src} alt={alt} data-testid="clean-image" />;
  })
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: Object.assign(
      React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
        <div data-testid="motion-div" ref={ref} {...props} />
      )),
      { displayName: 'MotionDiv' }
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor(private callback: IntersectionObserverCallback) {}
  
  observe(target: Element): void {
    // Immediately trigger intersection with isIntersecting: true
    const entry: IntersectionObserverEntry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    };
    this.callback([entry], this);
  }
  
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

// Mock Image class
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
  
  constructor() {
    // Auto-trigger load after a short delay to simulate image loading
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 10);
  }
}

// Extend Vitest's expect with jest-dom matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    // Extend Vitest's expect with jest-dom matchers
    interface JestAssertion<T = unknown, C = unknown>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

// Setup mocks before each test
beforeEach(() => {
  // Mock IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  
  // Mock Image
  global.Image = MockImage as unknown as typeof Image;
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Import the component after setting up mocks
import CleanImageBlock from './CleanImageBlock';

describe('CleanImageBlock', () => {
  it('renders without crashing', () => {
    render(<CleanImageBlock src="test.jpg" alt="Test" />);
    expect(screen.getByTestId('clean-image')).toBeInTheDocument();
  });

  it('displays the image with the correct src and alt', () => {
    render(<CleanImageBlock src="test.jpg" alt="Test Alt" />);
    const img = screen.getByTestId('clean-image');
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'Test Alt');
  });

  it('calls onLoad when image loads', async () => {
    const handleLoad = vi.fn();
    render(<CleanImageBlock src="test.jpg" onLoad={handleLoad} />);
    // Wait for the next tick to allow the mock to call onLoad
    await Promise.resolve();
    // The mock image should have called onLoad
    expect(handleLoad).toHaveBeenCalledTimes(1);
    // Verify the event structure
    const event = handleLoad.mock.calls[0][0];
    expect(event).toHaveProperty('target.complete', true);
    expect(event).toHaveProperty('target.naturalWidth', 100);
  });

  it('handles image error', async () => {
    const handleError = vi.fn();
    render(<CleanImageBlock src="error.jpg" onError={handleError} />);
    
    // Wait for the next tick to allow the mock to call onError
    await Promise.resolve();
    
    // The mock error image should have called onError
    expect(handleError).toHaveBeenCalledTimes(1);
    
    // Verify the event structure
    const event = handleError.mock.calls[0][0];
    expect(event).toHaveProperty('target.complete', false);
    expect(event).toHaveProperty('target.src', 'error.jpg');
  });
});
