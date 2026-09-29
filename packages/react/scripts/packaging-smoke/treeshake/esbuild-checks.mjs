// esbuild-side packaging checks, run inside the Vite fixture after the tarball
// is installed.
//
// esbuild bundles for Vite's dev-server dependency pre-bundling, tsup and
// others. It matches the `module` condition in the exports map for `import`
// and `require` alike, so both reach lib/esm. A map that split the two with
// `import` and `require` conditions would load two copies. So assert both
// halves:
//
//   1. An import-only graph gets the ESM build, so esbuild users tree-shake.
//   2. A graph mixing `import` and `require` loads a single copy, so a
//      ThemeProvider reaches every consumer.
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';

const work = path.resolve('esbuild-checks');
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work);

const write = (name, source) => {
  const file = path.join(work, name);
  fs.writeFileSync(file, source);
  return file;
};

const trees = (metafile) => {
  const inputs = Object.keys(metafile.inputs).filter((file) =>
    file.includes('@deque/cauldron-react/lib/')
  );
  return {
    esm: inputs.some((file) => file.includes('/lib/esm/')),
    cjs: inputs.some((file) => !file.includes('/lib/esm/'))
  };
};

const bundle = (entry, outfile) =>
  esbuild.build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    metafile: true,
    platform: 'browser',
    format: 'cjs',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    logLevel: 'silent'
  });

write(
  'copy-esm.mjs',
  "import { ThemeContext } from '@deque/cauldron-react';\n" +
    'export const ctx = ThemeContext;\n'
);
write(
  'copy-cjs.cjs',
  "const lib = require('@deque/cauldron-react');\n" +
    'module.exports = { ctx: lib.ThemeContext };\n'
);

const importOnly = await bundle(
  path.join(work, 'copy-esm.mjs'),
  path.join(work, 'import-only.cjs')
);
const importOnlyTrees = trees(importOnly.metafile);
assert(
  importOnlyTrees.esm && !importOnlyTrees.cjs,
  'esbuild: an import-only graph did not resolve to lib/esm alone ' +
    `(esm=${importOnlyTrees.esm} cjs=${importOnlyTrees.cjs}), so esbuild ` +
    'consumers lose tree-shaking.'
);

const mixedEntry = write(
  'copy-entry.js',
  "import { ctx as viaImport } from './copy-esm.mjs';\n" +
    "const { ctx: viaRequire } = require('./copy-cjs.cjs');\n" +
    "if (!viaImport) throw new Error('import: no ThemeContext');\n" +
    "if (!viaRequire) throw new Error('require: no ThemeContext');\n" +
    'console.log(viaImport === viaRequire ? "SAME" : "SPLIT");\n'
);
const mixedOut = path.join(work, 'mixed.cjs');
const mixed = await bundle(mixedEntry, mixedOut);
const mixedTrees = trees(mixed.metafile);

// The bundle is CJS with React external, so Node resolves react from the
// fixture's node_modules when it runs.
const result = execFileSync('node', [mixedOut], { encoding: 'utf8' }).trim();
assert.strictEqual(
  result,
  'SAME',
  'Dual-package hazard under esbuild: a graph mixing `import` and `require` ' +
    'loaded TWO copies of @deque/cauldron-react (ThemeContext identities ' +
    `differ; trees loaded: esm=${mixedTrees.esm} cjs=${mixedTrees.cjs}).`
);

console.log(
  'esbuild-checks OK: import-only graph uses lib/esm; mixed graph loads one ' +
    `copy (esm=${mixedTrees.esm} cjs=${mixedTrees.cjs})`
);
