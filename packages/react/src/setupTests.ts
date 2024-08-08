/* global window */
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { configureAxe } from 'jest-axe';

configureAxe({
  rules: {
    region: { enabled: false }
  }
});

if (
  !Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerText')
) {
  // JSDOM doesn't fully support innerText, but we can fall back to
  // using textContent for now until this gets patched
  Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
    get() {
      return this.textContent;
    }
  });
}

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
