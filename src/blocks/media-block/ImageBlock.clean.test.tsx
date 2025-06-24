import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Test utilities are available globally via Vitest config

// Mock the motion components
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  
  // Create a type-safe mock component
  const createMockComponent = <T extends keyof JSX.IntrinsicElements>(
    tag: T, 
    testId: string
  ) => {
    const Component = React.forwardRef<HTMLElement, React.ComponentProps<T>>(
      ({ children, ...props }, ref) => {
        return React.createElement(
          tag,
          { 
            ...props, 
            'data-testid': testId,
            ref: ref as React.Ref<HTMLElement> 
          },
          children
        );
      }
    );
    Component.displayName = `motion.${tag}`;
    return Component;
  };

  return {
    ...(actual as object),
    motion: {
      ...(actual as { motion: unknown }).motion as object,
      div: createMockComponent('div', 'motion-div'),
      figure: createMockComponent('figure', 'motion-figure'),
      button: createMockComponent('button', 'motion-button'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="animate-presence">
        {children}
      </div>
    ),
  };
});

// Import the actual component after mocks
import ImageBlock from './ImageBlock';

describe('ImageBlock Clean Tests', () => {
  const defaultProps = {
    src: 'https://example.com/test.jpg',
    alt: 'Test image',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders an image with the correct props', () => {
    render(<ImageBlock {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('handles image load', () => {
    const onLoad = vi.fn();
    render(<ImageBlock {...defaultProps} onLoad={onLoad} />);
    
    const image = screen.getByAltText('Test image');
    fireEvent.load(image);
    
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('handles image error', () => {
    const onError = vi.fn();
    render(
      <ImageBlock 
        src="https://example.com/error.jpg" 
        alt="Error test" 
        onError={onError} 
      />
    );
    
    const image = screen.getByAltText('Error test');
    fireEvent.error(image);
    
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('applies custom class name', () => {
    render(
      <div data-testid="test-container">
        <ImageBlock {...defaultProps} className="custom-class" />
      </div>
    );
    
    const container = screen.getByTestId('test-container').firstChild;
    expect(container).toHaveClass('custom-class');
  });

  it('shows zoom cursor when zoomable is true', () => {
    const { container } = render(
      <div data-testid="test-container">
        <ImageBlock {...defaultProps} zoomable />
      </div>
    );
    
    // The cursor-zoom-in class is on the zoomable container
    const zoomableContainer = container.querySelector('[data-testid="zoomable-image-container"]');
    expect(zoomableContainer).toBeInTheDocument();
    expect(zoomableContainer).toHaveClass('cursor-zoom-in');
  });

  it('does not show zoom when zoomable is false', () => {
    render(<ImageBlock {...defaultProps} zoomable={false} />);
    
    // When not zoomable, there should be no zoom container
    const zoomContainer = screen.queryByTestId('zoomable-image-container');
    expect(zoomContainer).not.toBeInTheDocument();
  });
});
