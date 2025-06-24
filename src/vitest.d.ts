/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

// This file provides type declarations for Vitest and Testing Library integration

declare module 'vitest' {
  interface JestMatchers<R = void, T = unknown> {
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toHaveAttribute(attr: string, value?: string | number | boolean | RegExp): R;
    toHaveValue(value?: string | string[] | number): R;
    toHaveStyle(css: string | Record<string, string | number>): R;
    toBeChecked(): R;
    toBeRequired(): R;
    toBeInvalid(): R;
    toBeValid(): R;
    toHaveFocus(): R;
    toContainElement(element: Element | null): R;
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
  }
}
