import 'vitest';
import '@testing-library/jest-dom';

// Extend the global Window interface
declare global {
  interface Window {
    // Add any global window properties used in tests
    Image: typeof Image;
    // Add other browser globals as needed
  }

  // Add global test variables
  namespace NodeJS {
    interface Global {
      Image: typeof Image;
      // Add other Node.js globals as needed
    }
  }

  // Add global test utilities
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: any): R;
    }
  }
}

// This export is needed for TypeScript to treat this file as a module
export {};
