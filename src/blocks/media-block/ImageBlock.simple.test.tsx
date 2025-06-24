import React, { type ReactNode } from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { ImageBlock } from './ImageBlock';

// Test utilities are available globally via Vitest config

// Mock framer-motion
vi.mock('framer-motion', () => {
  interface MotionProps {
    children?: ReactNode;
    initial?: Record<string, unknown> | boolean;
    animate?: Record<string, unknown> | boolean;
    exit?: Record<string, unknown> | boolean;
    transition?: Record<string, unknown>;
    layout?: boolean | 'position' | 'size' | 'preserve-aspect';
    layoutId?: string;
    onViewportEnter?: () => void;
    onViewportLeave?: () => void;
    viewport?: Record<string, unknown>;
    'data-testid'?: string;
    style?: React.CSSProperties;
    [key: string]: unknown; // Allow any additional props
    className?: string;
    onClick?: (event: React.MouseEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    role?: string;
    tabIndex?: number;
  }

  const motionDiv = React.forwardRef<HTMLDivElement, MotionProps & React.HTMLAttributes<HTMLDivElement>>(({ 
    children, 
    initial,
    animate,
    exit,
    transition,
    layout,
    layoutId,
    onViewportEnter,
    onViewportLeave,
    className,
    style,
    'data-testid': testId = 'motion-div',
    ...props 
  }, ref) => {
    // Handle viewport callbacks
    React.useEffect(() => {
      if (onViewportEnter) onViewportEnter();
      return () => {
        if (onViewportLeave) onViewportLeave();
      };
    }, [onViewportEnter, onViewportLeave]);

    return (
      <div 
        ref={ref} 
        data-testid={testId}
        data-layout={layout}
        data-layout-id={layoutId}
        className={className}
        style={{
          ...style,
          '--motion-initial': JSON.stringify(initial || {}),
          '--motion-animate': JSON.stringify(animate || {}),
          '--motion-exit': JSON.stringify(exit || {}),
          '--motion-transition': JSON.stringify(transition || {}),
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  });
  motionDiv.displayName = 'MotionDiv';

  const motionFigure = React.forwardRef<HTMLElement, MotionProps & React.HTMLAttributes<HTMLElement>>(({ 
    children, 
    initial,
    animate,
    exit,
    transition,
    layout,
    layoutId,
    className,
    style,
    onViewportEnter,
    onViewportLeave,
    'data-testid': testId = 'motion-figure',
    ...props 
  }, ref) => {
    // Handle viewport callbacks
    React.useEffect(() => {
      if (onViewportEnter) onViewportEnter();
      return () => {
        if (onViewportLeave) onViewportLeave();
      };
    }, [onViewportEnter, onViewportLeave]);

    return (
      <figure 
        ref={ref} 
        data-testid={testId}
        data-layout={layout}
        data-layout-id={layoutId}
        className={className}
        style={{
          ...style,
          '--motion-initial': JSON.stringify(initial || {}),
          '--motion-animate': JSON.stringify(animate || {}),
          '--motion-exit': JSON.stringify(exit || {}),
          '--motion-transition': JSON.stringify(transition || {}),
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </figure>
    );
  });
  motionFigure.displayName = 'MotionFigure';

  const AnimatePresenceComponent: React.FC<{ 
    children: React.ReactNode;
    onExitComplete?: () => void;
  }> = ({ children, onExitComplete }) => {
    React.useEffect(() => {
      return () => {
        onExitComplete?.();
      };
    }, [onExitComplete]);

    return <div data-testid="animate-presence">{children}</div>;
  };
  AnimatePresenceComponent.displayName = 'AnimatePresence';

  return {
    motion: {
      div: motionDiv,
      figure: motionFigure,
    },
    AnimatePresence: AnimatePresenceComponent,
    useAnimation: () => ({
      start: vi.fn().mockResolvedValue(undefined),
      set: vi.fn(),
      stop: vi.fn(),
    }),
    useInView: () => [vi.fn(), true],
    useReducedMotion: () => false,
    useAnimationControls: () => ({
      start: vi.fn().mockResolvedValue(undefined),
      set: vi.fn(),
      stop: vi.fn(),
    }),
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn().mockReturnValue([]),
}));

window.IntersectionObserver = mockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ImageBlock', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders image with correct attributes', () => {
    render(<ImageBlock {...defaultProps} />);
    
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders with zoomable class when zoomable prop is true', () => {
    render(<ImageBlock {...defaultProps} zoomable />);
    
    const container = screen.getByTestId('zoomable-image-container');
    expect(container).toHaveClass('relative');
  });

  it('renders image with correct attributes when zoomable', () => {
    render(<ImageBlock {...defaultProps} zoomable />);
    
    const image = screen.getByTestId('image-block-img');
    expect(image).toHaveAttribute('alt', 'Test image');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    // Check for expected classes
    expect(image).toHaveClass('block');
    expect(image).toHaveClass('transition-all');
    expect(image).toHaveClass('duration-300');
    expect(image).toHaveClass('rounded-lg');
    expect(image).toHaveClass('hover:opacity-90');
  });

  it('is clickable when zoomable is true', () => {
    const handleClick = vi.fn();
    render(<ImageBlock {...defaultProps} zoomable onClick={handleClick} />);
    const container = screen.getByTestId('zoomable-image-container');
    fireEvent.click(container);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('closes zoom when pressing Escape key', async () => {
    render(<ImageBlock {...defaultProps} zoomable />);
    
    // Open zoom
    const container = screen.getByTestId('zoomable-image-container');
    fireEvent.click(container);
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders caption when provided', () => {
    render(<ImageBlock {...defaultProps} caption="Test caption" />);
    
    const caption = screen.getByText('Test caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveClass('mt-2', 'text-sm', 'text-gray-600', 'text-center');
  });

  it('applies custom class name', () => {
    render(<ImageBlock {...defaultProps} className="custom-class" />);
    
    const container = screen.getByTestId('zoomable-image-container');
    expect(container).toHaveClass('custom-class');
  });
});
