// Simple test to verify TypeScript is working
const sum = (a: number, b: number): number => a + b;

describe('TypeScript Configuration', () => {
  it('should work with TypeScript', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
