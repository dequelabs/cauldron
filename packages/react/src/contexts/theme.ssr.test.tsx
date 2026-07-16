/**
 * @jest-environment node
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeProvider, useThemeContext } from './theme';

const ThemeTester = () => {
  useThemeContext();
  return <div />;
};

// This suite runs under the `node` environment (see the docblock above), where
// `document` is not a declared global — the same condition as an SSR framework
// prerendering a client component (e.g. Next.js App Router). A bare
// `document?.body` default would throw `ReferenceError: document is not
// defined` here, because optional chaining only guards against null/undefined
// values, not undeclared globals.
test('ThemeProvider renders without error when document is undefined (SSR)', () => {
  expect(typeof document).toBe('undefined');
  expect(() =>
    renderToString(
      <ThemeProvider initialTheme="dark">
        <ThemeTester />
      </ThemeProvider>
    )
  ).not.toThrow();
});
