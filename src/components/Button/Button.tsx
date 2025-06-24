import React, { forwardRef } from 'react';

// Define our button variants and sizes
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Define the props for our Button component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content of the button */
  children: React.ReactNode;
  /** 
   * The variant of the button
   * @default 'default'
   * @note This prop is currently not in use but is reserved for future styling implementation
   */
  variant?: ButtonVariant;
  /** 
   * The size of the button
   * @default 'default'
   * @note This prop is currently not in use but is reserved for future sizing implementation
   */
  size?: ButtonSize;
  /** Icon to display on the left side of the button */
  iconLeft?: React.ReactNode;
  /** Icon to display on the right side of the button */
  iconRight?: React.ReactNode;
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
  /** Test ID for testing libraries */
  testId?: string;
  /** Additional class name for the button */
  className?: string;
}

/**
 * A customizable button component with various styles and sizes.
 * 
 * @note The `variant` and `size` props are currently not in use but are reserved for future styling implementation.
 * The current implementation only supports basic button functionality with icon support.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  // These props are reserved for future styling implementation
  variant: _variant = 'default',
  size: _size = 'default',
  iconLeft,
  iconRight,
  fullWidth = false,
  testId,
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}, ref) => {
  // Build the class name
  const buttonClasses = [
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  // Create a button element with proper typing
  return (
    <button
      ref={ref}
      className={buttonClasses}
      data-testid={testId}
      disabled={disabled}
      type={type}
      {...props}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;