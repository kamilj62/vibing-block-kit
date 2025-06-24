/**
 * Environment detection utilities
 * 
 * This file provides reliable ways to detect the current environment.
 * Using this centralized utility ensures consistent environment detection
 * across the entire application.
 */

/**
 * Environment modes
 */
// Environment detection functions
const isDev = (): boolean => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return true;
  }
  
  // Fallback for other bundlers or Node.js
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    return true;
  }
  
  return false;
};

const isProd = (): boolean => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return true;
  }
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    return true;
  }
  return false;
};

const isTest = (): boolean => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.TEST) ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')
  );
};

export const Environment = {
  /** 
   * Whether the app is running in development mode
   * This is determined by checking for the Vite-specific import.meta.env.DEV
   * or falling back to process.env.NODE_ENV for compatibility
   */
  isDev: isDev(),
  
  /**
   * Whether the app is running in production mode
   */
  isProd: isProd(),
  
  /**
   * Whether the app is running in test mode (e.g., Jest, Vitest)
   */
  isTest: isTest()
} as const;

// Export the individual functions as well
export { isDev, isProd, isTest };
