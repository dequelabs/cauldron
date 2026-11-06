// Single-copy / dual-package-hazard guard.
//
// A consumer must resolve ONE copy of the package: `import` and `require` of the
// specifier have to yield the same React context object. If a future change
// (e.g. an `exports` map that splits `import`→ESM and `require`→CJS) makes them
// differ, a runtime that mixes both would load two copies — and a <ThemeProvider>
// from one copy would silently fail to reach consumers using the other.
import assert from 'node:assert';
import { createRequire } from 'node:module';
import * as imported from '@deque/cauldron-react';

const require = createRequire(import.meta.url);
const required = require('@deque/cauldron-react');

const importedContext = imported.ThemeContext ?? imported.default?.ThemeContext;

assert(importedContext, 'import: expected `ThemeContext` export');
assert(required.ThemeContext, 'require: expected `ThemeContext` export');
assert.strictEqual(
  required.ThemeContext,
  importedContext,
  'Dual-package hazard: `import` and `require` resolved DIFFERENT copies of ' +
    '@deque/cauldron-react (context identities differ), which would break ' +
    'providers/compound components across the split.'
);

console.log('single-copy OK: import and require share one copy');
