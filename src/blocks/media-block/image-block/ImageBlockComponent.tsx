import { useRef, useImperativeHandle, useState } from 'react';
import type { ForwardedRef, MouseEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';
import type { ImageBlockProps, ImageSource } from './types';

// Helper function to check if an object is an ImageSource
function isImageSource(item: unknown): item is ImageSource {
  return (
    typeof item === 'object' &&
    item !== null &&
    'src' in item &&
    typeof (item as { src: unknown }).src === 'string'
  );
}

// Helper function to safely get source string
function getSourceString(source: string | ImageSource | ImageSource[]): string {
  if (typeof source === 'string') return source;
  if (Array.isArray(source) && source.length > 0 && isImageSource(source[0])) {
    return source[0].src;
  }
  if (isImageSource(source)) return source.src;
  return '';
}

// Define constants for radius and shadow values with proper typing
// Note: These are kept as comments for reference but not used directly
// as we're using Tailwind classes instead
/*
const radiusMap = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const;

const shadowMap = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;
*/

// ImageOnlyProps type is kept for future use but currently not used in this file
// It's preserved as it might be used by other components that import this file

// Define the component props
type ImageBlockComponentProps = ImageBlockProps & {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  zoomable?: boolean;
  'data-testid'?: string;
};

// Define the component function
export function ImageBlockComponent(
  props: ImageBlockComponentProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  // Use useImperativeHandle to handle the ref
  const localRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => localRef.current || document.createElement('div'), []);
  
  // State for zoom and load status
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rest of the component implementation...
  // [Previous implementation remains the same until the end of the component]
  
  return (
    <div 
      ref={localRef}
      className={`relative w-full h-full image-block-container ${
        isZoomed ? 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4' : ''
      }`}
      data-testid={props['data-testid']}
    >
      {props.src && (
        <div 
          className={classNames('relative w-full h-full', {
            'cursor-pointer': props.zoomable,
            'cursor-zoom-in': props.zoomable && !isZoomed,
            'cursor-zoom-out': props.zoomable && isZoomed,
          })}
          role={props.zoomable ? 'button' : undefined}
          tabIndex={props.zoomable ? 0 : undefined}
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            if (props.zoomable) {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            } else if (props.onClick) {
              props.onClick(e);
            }
          }}
          onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
            if ((e.key === 'Enter' || e.key === ' ') && props.zoomable) {
              e.preventDefault();
              setIsZoomed(!isZoomed);
            } else if (e.key === 'Escape' && isZoomed) {
              e.preventDefault();
              setIsZoomed(false);
            }
          }}
          aria-label={props.zoomable ? (isZoomed ? 'Zoom out' : 'Zoom in') : undefined}
        >
          <img
            src={getSourceString(props.src)}
            alt={props.alt || ''}
            className={classNames(
              'block w-full h-full',
              {
                'rounded-none': props.borderRadius === 'none',
                'rounded-sm': props.borderRadius === 'sm',
                'rounded': props.borderRadius === 'md',
                'rounded-lg': props.borderRadius === 'lg',
                'rounded-full': props.borderRadius === 'full',
                'border border-gray-200': props.hasBorder,
                'shadow-none': props.shadow === 'none',
                'shadow-sm': props.shadow === 'sm',
                'shadow': props.shadow === 'md',
                'shadow-lg': props.shadow === 'lg',
                'shadow-xl': props.shadow === 'xl',
                'shadow-2xl': props.shadow === '2xl'
              },
              props.className
            )}
            style={{
              objectFit: props.objectFit || 'cover',
              ...(typeof props.borderRadius === 'number' && {
                borderRadius: `${props.borderRadius}px`
              }),
            }}
            loading="lazy"
            decoding={props.decoding || 'async'}
            fetchPriority={props.fetchPriority || 'auto'}
            onLoad={(e) => {
              setIsLoaded(true);
              if (props.onLoad) props.onLoad(e);
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              if (props.onError) {
                const error = new Error('Failed to load image');
                // Extend error with custom properties
                Object.defineProperties(error, {
                  event: { value: e },
                  source: { value: getSourceString(props.src) }
                });
                props.onError(error);
              }
            }}
            // Remove interactive props from img as they're now on the parent div
            tabIndex={-1}
            aria-hidden={props.zoomable ? 'true' : undefined}
          />
        </div>
      )}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Set display name for better debugging
ImageBlockComponent.displayName = 'ImageBlock';
