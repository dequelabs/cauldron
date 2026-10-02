// Next.js App Router check, run inside the Vite fixture after the tarball is
// installed.
//
// Next splits one app into server, SSR and client layers and bundles them with
// Turbopack, which no other step exercises. `next-app/` renders a
// "use client" ThemeProvider around a separate client component that reads
// the theme. If the two modules load different copies of the package, the
// reader falls back to the context default and the prerendered page shows
// `light` instead of `dark`.
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
  'Next.js: the client component did not read the provider theme, so the ' +
    'provider and reader loaded different copies of @deque/cauldron-react ' +
    `(got: ${html.match(/<span id="theme">.*?<\/span>/)?.[0]})`
);
for (const [marker, what] of [
  ['Button--primary', 'Button'],
  ['id="agree"', 'Checkbox'],
  ['hljs-keyword', 'highlighted Code']
]) {
  assert(html.includes(marker), `Next.js: the page rendered no ${what}`);
}

console.log(
  'next-checks OK: Turbopack SSR renders one copy with the provider theme'
);
