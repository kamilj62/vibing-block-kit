import * as React from 'react';
import { useState, useRef, forwardRef } from 'react';
import type { ImageBlockProps } from './types';

// Utility function to join class names
const cn = (...classes: Array<string | boolean | undefined>): string => 
  classes.filter(Boolean).join(' ');

// Define constants for radius and shadow values with proper typing
const radiusMap = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
} as const;

const shadowMap = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// Define the type for border radius scale
type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'full';

// Ensure the borderRadius prop matches our RadiusScale type
interface ImageBlockPropsWithRadius extends Omit<ImageBlockProps, 'borderRadius'> {
  borderRadius?: RadiusScale;
}


const ImageBlock = forwardRef<HTMLDivElement, ImageBlockPropsWithRadius>(({
  src: srcProp,
  alt = '',
  width = '100%',
  height = 'auto',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  caption,
  borderRadius = 'none',
  shadow = 'none',
  hasBorder = false,
  objectFit = 'cover',
  onLoad,
  onError,
  lqip,
  sizes = '100vw',
  className = '',
  style,
}, forwardedRef) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const mainSrc = (() => {
    if (!srcProp) return '';
    
    if (typeof srcProp === 'string') return srcProp;
    
    if (Array.isArray(srcProp)) {
      if (srcProp.length === 0) return '';
      const firstItem = srcProp[0];
      if (!firstItem) return '';
      
      if (typeof firstItem === 'string') return firstItem;
      if (firstItem && typeof firstItem === 'object' && 'src' in firstItem) {
        return String((firstItem as { src: string }).src);
      }
      return '';
    }
    
    if (typeof srcProp === 'object' && srcProp !== null && 'src' in srcProp) {
      return String((srcProp as { src: string }).src);
    }
    
    return '';
  })();

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = () => {
    const error = new Error('Failed to load image');
    onError?.(error);
  };

  if (!srcProp) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-500',
          hasBorder && 'border border-gray-200 dark:border-gray-700',
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          borderRadius: radiusMap[borderRadius] || radiusMap.md,
          boxShadow: shadowMap[shadow],
          ...style
        }}
      >
        No image source provided
      </div>
    );
  }

  return (
    <div
      ref={(node) => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
        // Use type assertion to handle the ref assignment
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      data-testid="image-block-container"
      className={cn(
        'relative overflow-hidden',
        hasBorder && 'border border-gray-200 dark:border-gray-700',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: radiusMap[borderRadius],
        boxShadow: shadowMap[shadow],
        ...style
      }}
    >
      {/* LQIP Background */}
      {lqip && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${lqip})`,
            filter: 'blur(8px)',
            transform: 'scale(1.05)'
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={mainSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        className={cn(
          'relative h-full w-full transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          `object-${objectFit}`
        )}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Caption */}
      {caption && (
        <figcaption 
          className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center text-sm text-white"
          data-testid="image-caption"
        >
          {caption}
        </figcaption>
      )}
    </div>
  );
});

// Set display name for better debugging
ImageBlock.displayName = 'ImageBlock';

export { ImageBlock };
