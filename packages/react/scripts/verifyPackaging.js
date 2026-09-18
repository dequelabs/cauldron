/**
 * Packaging validation harness for @deque/cauldron-react.
 *
 * Validates the *published* artifact rather than the workspace source:
 *
 *   1. Pack the package with `pnpm pack` (honors the `files` allowlist).
 *   2. `publint`  — lint the tarball for packaging mistakes.
 *   3. `attw`     — check that types resolve for every module condition.
 *   4. Smoke test — install the tarball into a throwaway consumer and confirm
 *      it resolves under both `require(...)` and native `import`.
 *   5. Stylesheet — assert the published `lib/cauldron.css` survived the install.
 *   6. Single-copy guard — assert `import` and `require` of the specifier yield
 *      the same context object (no dual-package hazard from split resolution).
 *   7. ESM build — import `lib/esm` by path (Node resolves the bare specifier
 *      through `main` to the CJS tree at `lib/`, so no other step covers it) and
 *      render the components whose CJS-default interop only breaks under ESM.
 *   8. webpack consumer — bundle with webpack and assert the three properties
 *      only it can falsify: the published stylesheet survives a production
 *      build, tree-shaking holds under its nearest-package.json `sideEffects`
 *      lookup, and a mixed `import`/`require` graph loads a single copy.
 *   9. Tree-shaking — bundle a Button-only consumer with Vite (Rollup) and
 *      assert the unused component graph (Code, react-syntax-highlighter,
 *      react-aria-components) is dropped.
 *
 * The consumers install from the tarball (not a workspace symlink), so
 * resolution matches what a real consumer would get from npm.
 *
 * Prerequisite: `lib/` must already be built (`pnpm build`). Run via the
 * `verify:packaging` package script, which builds first.
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const packageRoot = path.join(__dirname, '..');
const smokeFixtures = path.join(__dirname, 'packaging-smoke');
const libDir = path.join(packageRoot, 'lib');
const workspaceModules = path.join(packageRoot, '..', '..', 'node_modules');

// A Button-only bundle must not contain any of these — their presence means an
// unused component (and its heavy deps) failed to tree-shake. Asserted against
// both bundlers: Vite/Rollup below, and webpack via webpack-checks.cjs, which
// resolves `sideEffects` differently and is the only one that sees a nested
// marker file shadow the root manifest.
const forbidden = [
  'react-syntax-highlighter',
  'react-aria',
  'registerLanguage',
  'hljs',
  'lowlight'
];

function step(message) {
  console.log(`\n› ${message}`);
}

function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

if (!fs.existsSync(path.join(libDir, 'index.js'))) {
  console.error(
    'Missing build output at lib/index.js. Run `pnpm build` before verifying packaging.'
  );
  process.exit(1);
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cauldron-pkg-'));

try {
  step('Packing tarball');
  run('pnpm', ['pack', '--pack-destination', workDir], { cwd: packageRoot });

  const tarball = fs
    .readdirSync(workDir)
    .filter((file) => file.endsWith('.tgz'))
    .map((file) => path.join(workDir, file))[0];

  if (!tarball) {
    throw new Error(`pnpm pack did not produce a tarball in ${workDir}`);
  }
  console.log(`Packed ${path.basename(tarball)}`);

  step('Linting tarball with publint');
  run('pnpm', ['exec', 'publint', '--strict', tarball], { cwd: packageRoot });

  step('Checking type resolution with @arethetypeswrong/cli');
  run('pnpm', ['exec', 'attw', tarball], { cwd: packageRoot });

  step('Smoke testing require() + import from the packed tarball');
  const consumerDir = path.join(workDir, 'consumer');
  fs.mkdirSync(consumerDir);
  fs.writeFileSync(
    path.join(consumerDir, 'package.json'),
    JSON.stringify(
      { name: 'cauldron-packaging-smoke', version: '0.0.0', private: true },
      null,
      2
    )
  );
  fs.copyFileSync(
    path.join(smokeFixtures, 'smoke.cjs'),
    path.join(consumerDir, 'smoke.cjs')
  );
  fs.copyFileSync(
    path.join(smokeFixtures, 'smoke.mjs'),
    path.join(consumerDir, 'smoke.mjs')
  );
  fs.copyFileSync(
    path.join(smokeFixtures, 'single-copy.mjs'),
    path.join(consumerDir, 'single-copy.mjs')
  );
  fs.copyFileSync(
    path.join(smokeFixtures, 'esm-output.mjs'),
    path.join(consumerDir, 'esm-output.mjs')
  );

  // Install with npm into an isolated dir so resolution is hermetic and does
  // not touch the pnpm workspace. react/react-dom satisfy the peer range.
  run(
    'npm',
    [
      'install',
      tarball,
      'react@^19',
      'react-dom@^19',
      '--no-audit',
      '--no-fund',
      '--no-package-lock',
      '--no-save',
      '--ignore-scripts'
    ],
    { cwd: consumerDir }
  );
  run('node', ['smoke.cjs'], { cwd: consumerDir });
  run('node', ['smoke.mjs'], { cwd: consumerDir });

  // `package.json` publishes `style: lib/cauldron.css`, but neither publint
  // nor attw validates that field — they only cover JS entries and types. A
  // stylesheet dropped from the tarball (e.g. via a `files` change) would slip
  // through, so assert it survived the install and is non-empty.
  step('Verifying published stylesheet is present');
  const installedStylesheet = path.join(
    consumerDir,
    'node_modules',
    '@deque',
    'cauldron-react',
    'lib',
    'cauldron.css'
  );
  const stylesheetStats = fs.statSync(installedStylesheet, {
    throwIfNoEntry: false
  });
  if (!stylesheetStats || stylesheetStats.size === 0) {
    throw new Error(
      `Published stylesheet missing or empty: ${installedStylesheet}`
    );
  }
  step('Verifying a single copy resolves (dual-package-hazard guard)');
  run('node', ['single-copy.mjs'], { cwd: consumerDir });

  // Node resolves the bare specifier through `main` to the CJS tree at `lib/`,
  // so the steps above never load lib/esm. Import it by path and render the
  // components whose CJS-default interop only breaks under strict ESM.
  step('Verifying the ESM build imports and renders (lib/esm)');
  run('node', ['esm-output.mjs'], { cwd: consumerDir });

  // Everything above is Node-only, and the Vite step below cannot observe
  // webpack's nearest-package.json `sideEffects` lookup or its entry selection.
  // These three assertions cover the properties only webpack can falsify.
  step('Verifying webpack consumer (stylesheet, tree-shaking, single copy)');
  fs.copyFileSync(
    path.join(smokeFixtures, 'webpack-checks.cjs'),
    path.join(consumerDir, 'webpack-checks.cjs')
  );
  run(
    'node',
    ['webpack-checks.cjs', workspaceModules, JSON.stringify(forbidden)],
    { cwd: consumerDir }
  );

  step('Verifying tree-shaking (Button-only import drops unused components)');
  const treeshakeDir = path.join(workDir, 'treeshake');
  fs.mkdirSync(treeshakeDir);
  fs.writeFileSync(
    path.join(treeshakeDir, 'package.json'),
    JSON.stringify(
      {
        name: 'cauldron-treeshake',
        version: '0.0.0',
        private: true,
        type: 'module'
      },
      null,
      2
    )
  );
  fs.copyFileSync(
    path.join(smokeFixtures, 'treeshake.entry.js'),
    path.join(treeshakeDir, 'treeshake.entry.js')
  );
  fs.copyFileSync(
    path.join(smokeFixtures, 'treeshake.vite.config.js'),
    path.join(treeshakeDir, 'vite.config.js')
  );
  run(
    'npm',
    [
      'install',
      tarball,
      'react@^19',
      'react-dom@^19',
      'vite@^7',
      '--no-audit',
      '--no-fund',
      '--no-package-lock'
    ],
    { cwd: treeshakeDir }
  );
  run('npx', ['vite', 'build'], { cwd: treeshakeDir });

  const outDir = path.join(treeshakeDir, 'dist');
  const bundle = fs
    .readdirSync(outDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => fs.readFileSync(path.join(outDir, file), 'utf8'))
    .join('\n');
  const leaked = forbidden.filter((marker) => bundle.includes(marker));
  if (leaked.length > 0) {
    throw new Error(
      `Tree-shaking regressed: a Button-only bundle still contains ${leaked.join(
        ', '
      )}.`
    );
  }
  console.log(
    `Tree-shaking OK: Button-only bundle excludes ${forbidden.join(', ')}`
  );

  console.log('\n✓ Packaging validation passed');
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}
