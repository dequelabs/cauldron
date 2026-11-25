// Next.js App Router check, run inside the Vite fixture after the tarball is
// installed.
//
// Turbopack is the only bundler here that no other step exercises. The check
// asserts that the prerendered page renders with the provider theme, and that
// the client chunks leave out components the page does not use, which holds
// only when Turbopack bundles lib/esm.
//
// It cannot detect two copies of the package: both client modules `import` the
// same specifier, so Turbopack resolves them to one module either way.
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const appDir = path.resolve('next-app');
fs.rmSync(path.join(appDir, '.next'), { recursive: true, force: true });

execFileSync(path.resolve('node_modules', '.bin', 'next'), ['build', appDir], {
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
});

const html = fs.readFileSync(
  path.join(appDir, '.next', 'server', 'app', 'index.html'),
  'utf8'
);

assert(
  html.includes('<span id="theme">theme:dark</span>'),
  'Next.js: the client component did not read the provider theme ' +
    `(got: ${html.match(/<span id="theme">.*?<\/span>/)?.[0]})`
);
for (const [marker, what] of [
  ['Button--primary', 'Button'],
  ['id="agree"', 'Checkbox'],
  ['hljs-keyword', 'highlighted Code']
]) {
  assert(html.includes(marker), `Next.js: the page rendered no ${what}`);
}

// JS only: the imported stylesheet contains every component's class names.
const chunksDir = path.join(appDir, '.next', 'static', 'chunks');
const clientJs = fs
  .readdirSync(chunksDir, { recursive: true })
  .filter((file) => file.endsWith('.js'))
  .map((file) => fs.readFileSync(path.join(chunksDir, file), 'utf8'))
  .join('\n');

assert(
  clientJs.includes('Button--primary'),
  'Next.js: the client chunks do not contain Button, so the tree-shaking ' +
    'check below would pass on nothing.'
);
// Tooltip is not listed: Code renders it through CopyButton.
const unused = ['Dialog__', 'Pagination--', 'Toast--', 'react-aria'];
const leaked = unused.filter((marker) => clientJs.includes(marker));
assert.deepStrictEqual(
  leaked,
  [],
  `Next.js: the client chunks contain unused components (${leaked.join(
    ', '
  )}): Turbopack bundled the CJS build or stopped tree-shaking lib/esm.`
);

console.log(
  'next-checks OK: Turbopack renders with the provider theme and bundles ' +
    `lib/esm without ${unused.join(', ')}`
);
