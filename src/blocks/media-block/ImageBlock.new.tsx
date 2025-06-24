import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageBlockBaseProps } from './types';

// Extend the base props with additional features
export interface ImageBlockProps extends Omit<ImageBlockBaseProps, 'onLoad' | 'onError'> {
  /** Enable zoom/lightbox functionality */
  zoomable?: boolean;
  /** Custom overlay component for zoom/lightbox */
  zoomOverlay?: React.ReactNode;
  /** Custom overlay component (alias for zoomOverlay) */
  overlay?: React.ReactNode;
  /** Apply rounded corners */
  rounded?: boolean;
  /** Callback when zoom state changes */
  onZoomChange?: (isZoomed: boolean) => void;
  /** Enable lightbox mode (alias for zoomable) */
  lightbox?: boolean;
  /** Callback when image loads */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  /** Callback when image fails to load */
  onError?: (e: React.SyntheticEvent<HTMLImageElement> | string) => void;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  zoomable: zoomableProp,
  zoomOverlay,
  overlay,
  rounded = true,
  onLoad,
  onError,
  className = '',
  style,
  onClick,
  lightbox,
  onZoomChange,
  alt = '',
  width = '100%',
  height = 'auto',
  loading = 'lazy' as const,
  ...rest
}) => {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isZoomedRef = React.useRef(false);
  const isZoomable = zoomableProp ?? lightbox ?? true;
  const overlayToRender = zoomOverlay || overlay;



  // Toggle zoom state
  const toggleZoom = React.useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    const newIsZoomed = !isZoomedRef.current;
    setIsZoomed(newIsZoomed);
    
    // Call the original onClick if provided
    if (onClick && 'nativeEvent' in e) {
      onClick(e as React.MouseEvent<HTMLDivElement>);
    }
  }, [onClick]);

  // Handle keyboard events for accessibility
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleZoom(e);
    } else if (e.key === 'Escape' && isZoomedRef.current) {
      e.preventDefault();
      setIsZoomed(false);
    }
  }, [toggleZoom]);

  // Update the ref when isZoomed changes
  React.useEffect(() => {
    isZoomedRef.current = isZoomed;
    if (onZoomChange) {
      onZoomChange(isZoomed);
    }
  }, [isZoomed, onZoomChange]);

  // Handle click on the image
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomable) {
      toggleZoom(e);
    } else if (onClick) {
      onClick(e);
    }
  };



  // Handle click outside to close zoom
  React.useEffect(() => {
    if (!isZoomed) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsZoomed(false);
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isZoomed]);

  // Handle image load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    setCurrentSrc(e.currentTarget.src);
    onLoad?.(e);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onError?.(e);
  };

  // Set initial source
  React.useEffect(() => {
    if (src) {
      setCurrentSrc(src);
    }
  }, [src]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: rounded ? '0.5rem' : 0,
    overflow: 'hidden',
    position: 'relative',
    cursor: isZoomable ? 'zoom-in' : 'default',
    ...style,
  };

  // Zoomed container styles
  const zoomedContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    cursor: 'zoom-out',
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={containerStyle}
      onClick={handleClick}
      onKeyDown={isZoomable ? handleKeyDown : undefined}
      role={isZoomable ? 'button' : undefined}
      tabIndex={isZoomable ? 0 : undefined}
      aria-label={isZoomable ? 'Toggle zoom' : undefined}
      data-testid="image-block"
    >
      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        loading={loading}
        className={`w-full h-auto transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...rest}
      />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}

      {/* Zoom overlay */}
      <AnimatePresence>
        {isZoomed && isZoomable && (
          <motion.div
            key="zoom-overlay"
            data-testid="zoom-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={zoomedContainerStyle}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
            aria-label="Close zoomed image"
            role="button"
            tabIndex={0}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '90vw',
                maxHeight: '90vh',
                zIndex: 10000,
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {overlayToRender ? (
                <div data-testid="custom-overlay">
                  {overlayToRender}
                </div>
              ) : (
                <img
                  src={currentSrc}
                  alt={alt}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                  }}
                  loading="eager"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageBlock;
