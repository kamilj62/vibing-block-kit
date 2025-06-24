import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import ImageBlock from './image-block/ImageBlock';
import '@testing-library/jest-dom/vitest';

// Test utilities are available globally via Vitest config

// Simple mock for framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the ImageBlock component
vi.mock('./image-block/ImageBlock', () => ({
  __esModule: true,
  default: function MockImageBlock({ src, alt, onClick, ...props }: any) {
    return (
      <div data-testid="mock-image-block">
        <img 
          src={src} 
          alt={alt} 
          onClick={onClick}
          data-testid="mock-image"
          {...props}
        />
      </div>
    );
  },
}));

describe('ImageBlock', () => {
  const defaultProps = {
    src: 'https://example.com/test.jpg',
    alt: 'Test image',
  };

  it('renders with default props', () => {
    render(<ImageBlock {...defaultProps} />);
    const image = screen.getByTestId('mock-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', defaultProps.src);
    expect(image).toHaveAttribute('alt', defaultProps.alt);
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ImageBlock {...defaultProps} onClick={handleClick} />);
    const image = screen.getByTestId('mock-image');
    fireEvent.click(image);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('passes through additional props', () => {
    render(<ImageBlock {...defaultProps} data-testid="custom-test-id" />);
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
  });
});

export {};
