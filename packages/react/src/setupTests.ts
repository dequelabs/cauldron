/* global window */
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { configureAxe } from 'jest-axe';

configureAxe({
  rules: {
    region: { enabled: false }
  }
});

if (!('clipboard' in global.navigator)) {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: async () => null
    },
    configurable: true,
    writable: true
  });
}

if (!('execCommand' in global.document)) {
  Object.defineProperty(global.document, 'execCommand', {
    value: () => null,
    configurable: true,
    writable: true
  });
}
