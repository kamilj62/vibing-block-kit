import * as React from 'react';
import { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import type { ImageBlockProps } from './types';

// Define types for position and scale
interface Position {
  x: number;
  y: number;
}

// Zoom levels for the image
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3, 4] as const;

// Utility function to join class names
const cn = (...classes: Array<string | boolean | undefined>): string => 
  classes.filter(Boolean).join(' ');

/**
 * A responsive image component with zoom functionality
 */
const ImageBlock = forwardRef<HTMLDivElement, ImageBlockProps>(({
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
  onError: onErrorProp,
  className = '',
  lqip,
  zoomable = false,
  sizes = '100vw'
}, forwardedRef) => {
  // Component state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2); // Default to 1x zoom (index 2 in ZOOM_LEVELS)
  const [scale, setScale] = useState(1);
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Process image source
  const mainSrc = useMemo(() => {
    if (!srcProp) return '';
    if (typeof srcProp === 'string') return srcProp;
    if (Array.isArray(srcProp) && srcProp.length > 0) {
      const firstItem = srcProp[0];
      if (typeof firstItem === 'string') return firstItem;
      if (firstItem && typeof firstItem === 'object' && 'src' in firstItem) {
        return String((firstItem as { src: string }).src);
      }
    }
    return '';
  }, [srcProp]);

  // Toggle controls visibility
  const toggleControls = useCallback((show: boolean) => {
    if (zoomable) setShowControls(show);
  }, [zoomable]);

  // Zoom functionality
  const zoomIn = useCallback(() => {
    if (zoomLevel < ZOOM_LEVELS.length - 1) {
      const newZoomLevel = zoomLevel + 1;
      setZoomLevel(newZoomLevel);
      setScale(ZOOM_LEVELS[newZoomLevel]);
    }
  }, [zoomLevel]);
  
  const zoomOut = useCallback(() => {
    if (zoomLevel > 0) {
      const newZoomLevel = zoomLevel - 1;
      setZoomLevel(newZoomLevel);
      setScale(ZOOM_LEVELS[newZoomLevel]);
    }
  }, [zoomLevel]);
  
  const resetZoom = useCallback(() => {
    setZoomLevel(2); // Reset to 1x zoom
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Handle image load and error
  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  }, [onLoad]);

  const handleError = useCallback(() => {
    // Create a proper Error object
    const error = new Error('Failed to load image');
    onErrorProp?.(error);
  }, [onErrorProp]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      
      switch (e.key) {
        case 'Escape':
          setIsZoomed(false);
          resetZoom();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomed, resetZoom, zoomIn, zoomOut]);

  // Render the component
  if (!mainSrc) {
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
          borderRadius,
          boxShadow: shadow,
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
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        if (containerRef.current) {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      data-testid="image-block-container"
      role={zoomable ? 'button' : undefined}
      tabIndex={zoomable ? 0 : undefined}
      aria-label={zoomable ? 'View image in full screen' : undefined}
      className={cn(
        'relative overflow-hidden',
        hasBorder && 'border border-gray-200 dark:border-gray-700',
        zoomable && 'cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        boxShadow: shadow,
      }}
      onMouseEnter={() => toggleControls(true)}
      onMouseLeave={() => toggleControls(false)}
      onClick={() => zoomable && setIsZoomed(true)}
      onKeyDown={(e) => {
        if (zoomable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          setIsZoomed(true);
        }
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

      {/* Zoom Controls */}
      {zoomable && showControls && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button
            type="button"
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
        </div>
      )}

      {/* Zoomed View */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            ref={zoomRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === zoomRef.current) {
                setIsZoomed(false);
                resetZoom();
              }
            }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              drag={scale > 1}
              dragConstraints={zoomRef}
              dragElastic={0.1}
              dragMomentum={false}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={mainSrc}
                alt={alt}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                }}
              />
            </motion.div>

            {/* Close button */}
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
                resetZoom();
              }}
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Set display name for better debugging
ImageBlock.displayName = 'ImageBlock';

export { ImageBlock };
export type { ImageBlockProps };
