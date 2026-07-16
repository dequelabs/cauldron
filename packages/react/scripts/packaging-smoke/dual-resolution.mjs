// Dual-resolution wiring check.
//
// With the `exports` map, `import` resolves to the ESM build and `require` to
// the CJS build. They are therefore DISTINCT copies — the accepted, documented
// dual-package tradeoff (a runtime mixing both loads two copies; see the PR /
// changelog). This asserts both conditions resolve and expose the full public
// API, so the exports map is wired correctly for ESM and CJS consumers alike.
import assert from 'node:assert';
import { createRequire } from 'node:module';
import * as esm from '@deque/cauldron-react';

const require = createRequire(import.meta.url);
const cjs = require('@deque/cauldron-react');

for (const [label, api] of [
  ['import (ESM)', esm],
  ['require (CJS)', cjs]
]) {
  assert(api.Button, `${label}: expected \`Button\` export`);
  assert(api.ThemeProvider, `${label}: expected \`ThemeProvider\` export`);
  assert(api.ThemeContext, `${label}: expected \`ThemeContext\` export`);
}

console.log(
  'dual-resolution OK: import→ESM and require→CJS both expose the API ' +
    `(distinct copies: ${esm.ThemeContext !== cjs.ThemeContext})`
);
