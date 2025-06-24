// @vitest-environment jsdom

/// <reference types="vitest/globals" />

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageBlock } from './ImageBlock.new';
import '@testing-library/jest-dom/vitest';

// Test utilities are available globally via Vitest config

// Extend global types for test environment
declare global {
  // For test environment flag
  // eslint-disable-next-line no-var
  var __VITEST__: boolean | undefined;
  
  // For Image mock - using a type that's compatible with both the mock and the real Image constructor
  interface Window {
    Image: new (width?: number, height?: number) => HTMLImageElement;
  }
}

// Mock for global.Image
class MockImage {
  onload: (() => void) | null = null;
  onerror: ((event: Event | string) => void) | null = null;
  src = '';
  width = 100;
  height = 100;
  complete = false;
  naturalWidth = 100;
  naturalHeight = 100;
  alt = '';
  
  constructor(width?: number, height?: number) {
    if (width !== undefined) this.width = width;
    if (height !== undefined) this.height = height;
    
    setTimeout(() => {
      if (this.onload) {
        this.complete = true;
        const loadEvent = new Event('load');
        // @ts-expect-error - The load event needs to be passed to the handler
        this.onload(loadEvent);
      }
    }, 10);
  }
  
  // Add required prototype methods
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
  getAttribute() { return null; }
  setAttribute() {}
  removeAttribute() {}
  hasAttribute() { return false; }
  getBoundingClientRect() { return { width: this.width, height: this.height, top: 0, left: 0, right: this.width, bottom: this.height, x: 0, y: 0, toJSON: () => ({}) }; }
}

// Extend global types
declare global {
  // For test environment flag
  // eslint-disable-next-line no-var
  var __VITEST__: boolean | undefined;
  
  // For Image mock
  interface Window {
    Image: {
      prototype: HTMLImageElement;
      new (width?: number, height?: number): HTMLImageElement;
    };
  }
}

// Assign mock to global
Object.defineProperty(window, 'Image', {
  value: MockImage,
  writable: true,
  configurable: true,
});

// Set up global mocks before tests run
beforeAll(() => {
  // Save original Image constructor
  const OriginalImage = window.Image;
  
  // Mock global Image
  Object.defineProperty(window, 'Image', {
    value: MockImage,
    writable: true,
    configurable: true,
  });
  
  // Restore original Image after tests
  return () => {
    // Use type assertion with proper type for window
    (window as Window & { Image: typeof OriginalImage }).Image = OriginalImage;
  };
});

afterAll(() => {
  // Clean up global mocks after tests
  // Use Object.defineProperty to safely remove the Image property
  if ('Image' in window) {
    Object.defineProperty(window, 'Image', {
      value: undefined,
      configurable: true,
      writable: true
    });
  }
});

// Track zoom state for testing
interface ZoomState {
  _isZoomed: boolean;
  callbacks: Set<() => void>;
  isZoomed: boolean;
  update: () => void;
  setZoomed: (value: boolean) => void;
  [key: string]: unknown; // Allow additional properties if needed
}

const zoomState: ZoomState = {
  _isZoomed: false,
  callbacks: new Set<() => void>(),
  get isZoomed() {
    return this._isZoomed;
  },
  update() {
    this.callbacks.forEach(cb => cb());
  },
  setZoomed(value: boolean) {
    this._isZoomed = value;
    this.update();
  }
};

// Import testing library matchers
import '@testing-library/jest-dom';

// Extend the global jest matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    }
  }
}

// Export for testing
export const testUtils = {
  zoomState,
  getZoomState: () => zoomState.isZoomed,
  setZoomState: (value: boolean) => {
    zoomState.setZoomed(value);
  },
  addZoomListener: (cb: () => void) => {
    zoomState.callbacks.add(cb);
    return () => zoomState.callbacks.delete(cb);
  },
  reset: () => {
    zoomState._isZoomed = false;
    zoomState.callbacks.clear();
  }
} as const;

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  
  // Define the MotionComponentProps type
  interface MotionComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    exit?: Record<string, unknown>;
    transition?: Record<string, unknown>;
    className?: string;
    style?: React.CSSProperties;
    'data-testid'?: string;
    layout?: boolean | 'position' | 'size' | 'preserve-aspect';
    children?: React.ReactNode;
  }

  const MotionComponent = React.forwardRef<HTMLDivElement, MotionComponentProps>(({ 
    children, 
    'data-testid': testId = 'motion-div',
    style,
    // We don't need these motion props in our mock
    /* eslint-disable @typescript-eslint/no-unused-vars */
    animate,
    initial,
    exit,
    transition,
    layout,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...props 
  }, ref) => {
    // Create a ref callback to handle both function and object refs
    const setRef = (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };
    // For zoom overlay
    if (testId === 'zoom-overlay') {
      return (
        <div 
          ref={setRef}
          data-testid="zoom-overlay"
          data-zoom-state={zoomState.isZoomed ? 'zoomed' : 'unzoomed'}
          role="button"
          tabIndex={0}
          onClick={() => zoomState.setZoomed(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              zoomState.setZoomed(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            ...style
          }}
          {...props}
        >
          {children}
        </div>
      );
    }
    
    // For other motion components, just pass through
    return (
      <div 
        ref={setRef}
        data-testid={testId}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  });

  // Set display name for better debugging
  MotionComponent.displayName = 'MotionComponent';
  
  // Mock AnimatePresence
  const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="animate-presence">{children}</div>;
  };
  
  // Mock useAnimation
  const useAnimation = vi.fn().mockReturnValue({
    start: vi.fn().mockImplementation(async (animation: { opacity?: number; scale?: number }) => {
      if (animation && (animation.opacity === 0 || animation.scale === 0.9)) {
        zoomState.setZoomed(false);
      } else {
        zoomState.setZoomed(true);
      }
    }),
    set: vi.fn(),
    stop: vi.fn(),
    isActive: false,
  });
  
  // Mock useInView
  const useInView = vi.fn().mockReturnValue({
    ref: vi.fn(),
    inView: true,
    entry: null,
  });
  
  // Mock useReducedMotion
  const useReducedMotion = vi.fn().mockReturnValue(false);
  
  interface FramerMotionModule {
    motion: {
      div: React.ForwardRefExoticComponent<MotionComponentProps & React.RefAttributes<HTMLDivElement>>;
      img: React.ForwardRefExoticComponent<MotionComponentProps & React.ImgHTMLAttributes<HTMLImageElement> & React.RefAttributes<HTMLImageElement>>;
    };
    AnimatePresence: React.ComponentType<{ children?: React.ReactNode }>;
    useAnimation: () => {
      start: (animation: Record<string, unknown>) => Promise<void>;
      set: (value: Record<string, unknown>) => void;
      stop: () => void;
    };
    useInView: () => { ref: (node?: Element | null) => void; inView: boolean };
    useReducedMotion: () => boolean;
  }

  // Cast the actual module to our mock type safely
  const actualModule = actual as unknown as Partial<FramerMotionModule>;

  // Create the mock img component with proper typing and display name
  const MockMotionImg = React.forwardRef<HTMLImageElement, MotionComponentProps & React.ImgHTMLAttributes<HTMLImageElement>>(
    (props, ref) => {
      const { children, alt = '', ...rest } = props;
      return (
        <img 
          ref={ref} 
          alt={alt}
          data-testid={props['data-testid'] || 'motion-img'}
          {...rest}
        >
          {children}
        </img>
      );
    }
  );
  MockMotionImg.displayName = 'MockMotionImg';

  // Create the mock module with proper typing
  const mockModule = {
    ...actualModule,
    motion: {
      ...(actualModule.motion || {}),
      div: MotionComponent,
      img: MockMotionImg as unknown as React.ForwardRefExoticComponent<
        MotionComponentProps & 
        React.ImgHTMLAttributes<HTMLImageElement> & 
        React.RefAttributes<HTMLImageElement>
      >,
    },
    AnimatePresence,
    useAnimation,
    useInView,
    useReducedMotion,
  };

  return mockModule as unknown as typeof import('framer-motion');
});

describe('ImageBlock', () => {
  // Mock functions for testing
  const mockOnClick = vi.fn();

  beforeAll(() => {
    // Mock Image class for testing
    class MockImage {
      onload: (() => void) | null = null;
      onerror: ((event: Event | string) => void) | null = null;
      src = '';
      width = 100;
      height = 100;
      complete = false;
      naturalWidth = 100;
      naturalHeight = 100;
      alt = '';

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.complete = true;
            const loadEvent = new Event('load');
            // @ts-expect-error - The load event needs to be passed to the handler
            this.onload(loadEvent);
          }
        }, 10);
      }
    }


    // @ts-expect-error - Mock global Image
    global.Image = MockImage;
  });

  afterAll(() => {
// @ts-expect-error - Restore global Image
    delete global.Image;
    vi.clearAllMocks();
  });

  it('renders with required props', () => {
    render(<ImageBlock src="test.jpg" alt="Test" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'Test');
  });

  it('handles click event', () => {
    const { container } = render(
      <ImageBlock
        src="test.jpg"
        alt="Test Image"
        zoomable={true}
        onClick={mockOnClick}
      />
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();

    // Test click event
    fireEvent.click(container.firstChild as HTMLElement);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('handles image loading', () => {
    render(<ImageBlock src="test.jpg" alt="Test Loading" />);
    const img = screen.getByRole('img');
    fireEvent.load(img);
    // Just verify the image renders and can be loaded
    expect(img).toBeInTheDocument();
  });

  it('toggles zoom state when zoomable image is clicked', async () => {
    let zoomState = false;
    const handleZoomChange = (isZoomed: boolean) => {
      zoomState = isZoomed;
    };

    const { container } = render(
      <ImageBlock 
        src="test.jpg" 
        alt="Test"
        zoomable
        onZoomChange={handleZoomChange}
      />
    );
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    
    // Initial click should set zoom to true
    fireEvent.click(img!);
    
    // Wait for state update (next tick)
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify zoom state was updated
    expect(zoomState).toBe(true);
    
    // Click the zoom overlay to zoom out
    const overlay = screen.getByTestId('zoom-overlay');
    fireEvent.click(overlay);
    
    // Wait for state update (next tick)
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify zoom state was updated back to false
    expect(zoomState).toBe(false);
  });
});
