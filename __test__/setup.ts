import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * `next/font/google` only works inside the Next.js compiler. In tests the
 * fonts the app loads (app/fonts.ts, app/layout.tsx) return a plain class.
 */
vi.mock('next/font/google', () => {
  const loadFont = () => ({
    className: 'font-mock',
    variable: '--font-mock',
    style: { fontFamily: 'mock' },
  });
  return {
    Geist: loadFont,
    Geist_Mono: loadFont,
    Inter: loadFont,
    Roboto_Condensed: loadFont,
  };
});

/**
 * Browser APIs jsdom does not implement but Radix UI primitives (checkbox,
 * radio group, select) call while mounting or opening.
 */
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};

afterEach(cleanup);
