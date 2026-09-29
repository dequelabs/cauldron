/* global window */
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { configureAxe } from 'jest-axe';

configureAxe({
  rules: {
    region: { enabled: false }
  }
});

// Guard the DOM-dependent shims so this setup can also run under the `node`
// test environment (used by SSR test suites), where `navigator`/`document` are
// not declared globals.
if (
  typeof global.navigator !== 'undefined' &&
  !('clipboard' in global.navigator)
) {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: async () => null
    },
    configurable: true,
    writable: true
  });
}

if (
  typeof global.document !== 'undefined' &&
  !('execCommand' in global.document)
) {
  Object.defineProperty(global.document, 'execCommand', {
    value: () => null,
    configurable: true,
    writable: true
  });
}
