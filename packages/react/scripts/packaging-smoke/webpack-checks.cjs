/**
 * webpack-side packaging checks, run inside the throwaway consumer.
 *
 * The Vite tree-shake step cannot see three properties that only break under
 * webpack's resolution rules:
 *
 *   1. Stylesheet retention. webpack's production `sideEffects` pass will drop a
 *      bindingless CSS import from a package whose nearest `package.json` says
 *      `sideEffects: false`. Vite never sees this — the fixture imports no CSS.
 *   2. Tree-shaking. webpack reads `sideEffects` from the `package.json` NEAREST
 *      the module, so a nested marker file shadows the root manifest; Rollup (and
 *      therefore Vite) reads it from the resolved package's manifest instead and
 *      stays green either way.
 *   3. Single copy. `single-copy.mjs` compares `import` vs `require` under Node,
 *      where only bundlers match the `module` condition and both land on
 *      lib/index.js — so it cannot fail today. A bundler picks entries
 *      differently, and that is the resolution path real consumers use.
 *
 * Usage: node webpack-checks.cjs <workspace-node-modules> <forbidden-json> <required-marker>
 *
 * webpack and its loaders come from the workspace rather than a fresh install:
 * they are tools, not the artifact under test, so borrowing the version the repo
 * already pins keeps this step off the network and in lockstep with the docs and
 * Storybook builds. Only loaders resolve from the workspace. Bundled code
 * resolves from the consumer's `node_modules` alone, so a runtime dependency the
 * tarball forgot to declare fails here instead of being borrowed.
 */
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const [workspaceModules, forbiddenJson, required] = process.argv.slice(2);

assert(
  workspaceModules && forbiddenJson && required,
  'usage: webpack-checks.cjs <workspace-node-modules> <forbidden-json> <required-marker>'
);
const forbidden = JSON.parse(forbiddenJson);

const webpack = require(path.join(workspaceModules, 'webpack'));
const MiniCssExtractPlugin = require(
  path.join(workspaceModules, 'mini-css-extract-plugin')
);

const consumer = process.cwd();
const work = path.join(consumer, 'webpack-checks');
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

const write = (name, source) => {
  const file = path.join(work, name);
  fs.writeFileSync(file, source);
  return file;
};

function compile(name, entry, extra = {}) {
  const { resolve: resolveExtra = {}, ...config } = extra;
  const outDir = path.join(work, 'out', name);

  return new Promise((resolvePromise, reject) => {
    webpack(
      {
        mode: 'production',
        entry,
        output: { path: outDir, filename: 'bundle.js' },
        resolve: {
          // The relative 'node_modules' keeps webpack's default walk-up for
          // dependencies nested inside another package's node_modules.
          modules: [path.join(consumer, 'node_modules'), 'node_modules'],
          ...resolveExtra
        },
        resolveLoader: { modules: [workspaceModules] },
        externals: {
          react: 'commonjs react',
          'react-dom': 'commonjs react-dom',
          'react/jsx-runtime': 'commonjs react/jsx-runtime'
        },
        ...config
      },
      (err, stats) => {
        if (err) return reject(err);
        if (stats.hasErrors()) {
          return reject(new Error(stats.toString({ errors: true })));
        }
        resolvePromise(outDir);
      }
    );
  });
}

const readAll = (dir, ext) =>
  fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(ext))
    .map((file) => fs.readFileSync(path.join(dir, file), 'utf8'))
    .join('\n');

async function checkStylesheetSurvives() {
  const installedCss = path.join(
    consumer,
    'node_modules/@deque/cauldron-react/lib/cauldron.css'
  );
  const source = fs.readFileSync(installedCss, 'utf8');

  // Derive the probe selector from the stylesheet itself rather than hardcoding
  // one, so this assertion cannot drift out of sync with the published CSS.
  const selector = source.match(/\.([A-Za-z][\w-]{4,})/)?.[1];
  assert(selector, `Could not find a class selector in ${installedCss}`);

  const entry = write(
    'css-entry.js',
    "import '@deque/cauldron-react/lib/cauldron.css';\n"
  );
  const outDir = await compile('css', entry, {
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }
      ]
    },
    plugins: [new MiniCssExtractPlugin({ filename: 'styles.css' })]
  });

  const emitted = readAll(outDir, '.css');
  assert(
    emitted.length > 0,
    'webpack emitted no CSS at all: the published stylesheet was dropped from a ' +
      'production build. A blanket `sideEffects: false` on this package does ' +
      'exactly this — scope it to `["**/*.css"]`.'
  );
  assert(
    emitted.includes(selector),
    `Published stylesheet was pruned: selector .${selector} is in lib/cauldron.css ` +
      'but absent from the webpack production build.'
  );
  console.log(
    `  stylesheet OK: ${emitted.length} bytes emitted, .${selector} retained`
  );
}

async function checkTreeShaking() {
  const entry = write(
    'treeshake-entry.js',
    "import { Button } from '@deque/cauldron-react';\n" +
      'if (!Button) throw new Error("Button missing");\n'
  );
  const outDir = await compile('treeshake', entry);

  const bundle = readAll(outDir, '.js');
  assert(
    bundle.includes(required),
    `webpack's Button-only bundle does not contain ${required}: Button itself ` +
      'was dropped, so the leak check below would pass on nothing.'
  );

  const leaked = forbidden.filter((marker) => bundle.includes(marker));
  assert.deepStrictEqual(
    leaked,
    [],
    `Tree-shaking regressed under webpack: a Button-only bundle still contains ${leaked.join(
      ', '
    )}. webpack resolves \`sideEffects\` from the package.json nearest each ` +
      "module, so check that every emitted output directory's marker carries " +
      '`sideEffects: false`.'
  );
  console.log(
    `  tree-shaking OK: ${bundle.length} bytes, none of [${forbidden.join(
      ', '
    )}]`
  );
}

async function checkSingleCopy() {
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
  const entry = write(
    'copy-entry.js',
    "import { ctx as viaImport } from './copy-esm.mjs';\n" +
      "const { ctx: viaRequire } = require('./copy-cjs.cjs');\n" +
      "if (!viaImport) throw new Error('import: no ThemeContext');\n" +
      "if (!viaRequire) throw new Error('require: no ThemeContext');\n" +
      'console.log(viaImport === viaRequire ? "SAME" : "SPLIT");\n'
  );

  const outDir = await compile('single-copy', entry, {
    mode: 'development',
    devtool: false,
    target: 'node'
  });

  const bundle = readAll(outDir, '.js');
  const trees = {
    esm: /cauldron-react\/lib\/esm\//.test(bundle),
    cjs: /cauldron-react\/lib\/(?!esm\/)/.test(bundle)
  };

  const result = execFileSync('node', [path.join(outDir, 'bundle.js')], {
    encoding: 'utf8'
  }).trim();

  assert.strictEqual(
    result,
    'SAME',
    'Dual-package hazard under a bundler: a graph mixing `import` and ' +
      '`require` loaded TWO copies of @deque/cauldron-react (ThemeContext ' +
      `identities differ; trees loaded: esm=${trees.esm} cjs=${trees.cjs}). A ` +
      'ThemeProvider from one copy cannot reach consumers of the other, and ' +
      'compound components break across the split.'
  );
  console.log(
    `  single copy OK: one copy in a mixed import/require graph (esm=${trees.esm} cjs=${trees.cjs})`
  );
}

(async () => {
  await checkStylesheetSurvives();
  await checkTreeShaking();
  await checkSingleCopy();
  console.log('webpack-checks OK');
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
