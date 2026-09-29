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
 *   6. Layout — assert the CJS build is a single bundle, `lib/esm` carries no
 *      declarations, and deep type imports compile under `bundler`, `node16`
 *      and `node10`.
 *   7. Single-copy guard — assert `import` and `require` of the specifier yield
 *      the same context object (no dual-package hazard from split resolution).
 *   8. ESM build — import `lib/esm` by path (Node resolves the bare
 *      specifier to the CJS build at `lib/`, so no other step covers it) and
 *      render the components whose CJS-default interop only breaks under ESM.
 *   9. webpack consumer — bundle with webpack and assert the three properties
 *      only it can falsify: the published stylesheet survives a production
 *      build, tree-shaking holds under its nearest-package.json `sideEffects`
 *      lookup, and a mixed `import`/`require` graph loads a single copy.
 *  10. Tree-shaking — bundle a Button-only consumer with Vite (Rollup) and
 *      assert Button is kept while the heavy dependencies (Code's highlighter
 *      graph, react-aria-components) and a sample of unrelated components are
 *      dropped.
 *  11. esbuild consumer — assert an import-only graph resolves to `lib/esm` and
 *      a mixed `import`/`require` graph loads a single copy.
 *  12. Next.js consumer — build an App Router page with Turbopack and assert
 *      the prerendered HTML shows a client provider's theme reaching a separate
 *      client component, so the provider and its readers share one copy.
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

// A Button-only bundle must not contain any of these. The first group marks the
// heavy dependencies (Code's highlighter graph, react-aria-components); the
// class-name prefixes mark unrelated components that have no heavy deps, so a
// barrel that stopped tree-shaking at all still gets caught. Asserted against
// both bundlers: Vite/Rollup below, and webpack via webpack-checks.cjs, which
// resolves `sideEffects` differently and is the only one that sees a nested
// marker file shadow the root manifest.
const forbidden = [
  'react-syntax-highlighter',
  'react-aria',
  'registerLanguage',
  'hljs',
  'lowlight',
  'Dialog__',
  'Pagination--',
  'Toast--',
  'Tooltip--'
];
// ...and must contain this, so an empty or over-pruned bundle can't pass the
// leak check by containing nothing.
const required = 'Button--primary';

const listFiles = (dir) =>
  fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path.relative(dir, path.join(entry.parentPath, entry.name))
    );

/**
 * The CJS tree must stay a single bundle: per-module CJS files under
 * `lib/components/` would let a deep import load a second copy of the library
 * next to the barrel's ESM copy. `lib/components/` carries declarations only.
 */
function verifyLayout(installedPackage) {
  const lib = path.join(installedPackage, 'lib');
  const files = listFiles(lib);

  for (const required of [
    'index.js',
    'index.d.ts',
    'types.d.ts',
    'components/Button/index.d.ts',
    'esm/index.js',
    'esm/package.json'
  ]) {
    if (!files.includes(required)) {
      throw new Error(`Published package is missing lib/${required}`);
    }
  }

  const esmDeclarations = files.filter(
    (file) => file.startsWith(`esm${path.sep}`) && file.endsWith('.d.ts')
  );
  if (esmDeclarations.length > 0) {
    throw new Error(
      `lib/esm must not contain declarations (types come from lib/): ${esmDeclarations
        .slice(0, 3)
        .join(', ')}`
    );
  }

  const nestedCjs = files.filter(
    (file) =>
      file.endsWith('.js') &&
      file.includes(path.sep) &&
      !file.startsWith(`esm${path.sep}`)
  );
  if (nestedCjs.length > 0) {
    throw new Error(
      'The CJS build must be a single bundle, but it emitted per-module files ' +
        `that consumers could deep-import at runtime: ${nestedCjs
          .slice(0, 3)
          .join(', ')}`
    );
  }
  console.log(
    `Layout OK: ${files.length} files, CJS bundled, no declarations in lib/esm`
  );
}

/**
 * Consumers across the org import types from `lib/components/<Name>`, from
 * files inside a component directory (`lib/components/Combobox/ComboboxOption`)
 * and from `lib/types`, some with plain `import` syntax for type-only names.
 * Compile a consumer that does all of that under each module resolution mode a
 * TypeScript app is likely to use. Under node16, only CJS-format files can use
 * extensionless deep paths; ESM-format files need an `exports` map for that.
 */
function verifyDeepTypeImports(consumerDir) {
  const source =
    "import type { ContentNode } from '@deque/cauldron-react/lib/types';\n" +
    "import type { ButtonProps } from '@deque/cauldron-react/lib/components/Button';\n" +
    "import type { RadioItem } from '@deque/cauldron-react/lib/components/RadioGroup';\n" +
    "import { ComboboxValue } from '@deque/cauldron-react/lib/components/Combobox/ComboboxOption';\n" +
    "import type { ActionMenuTriggerProps } from '@deque/cauldron-react';\n" +
    'export type Probe = [ContentNode, ButtonProps, RadioItem, ComboboxValue, ActionMenuTriggerProps];\n';
  fs.writeFileSync(path.join(consumerDir, 'types-consumer.ts'), source);
  const tsc = path.join(workspaceModules, 'typescript', 'bin', 'tsc');

  for (const [module, moduleResolution, files, extra] of [
    ['preserve', 'bundler', ['types-consumer.ts']],
    ['node16', 'node16', ['types-consumer.ts']],
    // TypeScript 6 deprecates node10, but apps on older configs still use it.
    ['commonjs', 'node10', ['types-consumer.ts'], { ignoreDeprecations: '6.0' }]
  ]) {
    const project = path.join(consumerDir, `tsconfig.${moduleResolution}.json`);
    fs.writeFileSync(
      project,
      JSON.stringify({
        compilerOptions: {
          module,
          moduleResolution,
          noEmit: true,
          strict: true,
          skipLibCheck: true,
          types: [],
          ...extra
        },
        files
      })
    );
    run('node', [tsc, '-p', project], { cwd: consumerDir });
  }
}

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

  step('Verifying published layout and deep type imports');
  verifyLayout(
    path.join(consumerDir, 'node_modules', '@deque', 'cauldron-react')
  );
  verifyDeepTypeImports(consumerDir);

  step('Verifying a single copy resolves (dual-package-hazard guard)');
  run('node', ['single-copy.mjs'], { cwd: consumerDir });

  // Node resolves the bare specifier to the CJS build at `lib/`, so the steps
  // above never load lib/esm. Import it by path and render the
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
    [
      'webpack-checks.cjs',
      workspaceModules,
      JSON.stringify(forbidden),
      required
    ],
    { cwd: consumerDir }
  );

  step('Verifying tree-shaking (Button-only import drops unused components)');
  // The Vite consumer is a committed fixture with its own package-lock.json, so
  // `npm ci` installs Vite and everything it runs at build time from locked,
  // integrity-checked versions. Only the tarball under test is added on top.
  // Vite 7 builds with Rollup; the step's "Vite (Rollup)" wording and the
  // unminified-output assumption need revisiting if the lock moves to Vite 8,
  // which builds with Rolldown.
  const treeshakeDir = path.join(workDir, 'treeshake');
  fs.cpSync(path.join(smokeFixtures, 'treeshake'), treeshakeDir, {
    recursive: true
  });
  const npmFlags = ['--no-audit', '--no-fund', '--ignore-scripts'];
  run('npm', ['ci', ...npmFlags], { cwd: treeshakeDir });
  run('npm', ['install', tarball, '--no-save', ...npmFlags], {
    cwd: treeshakeDir
  });
  // The local binary, not `npx`, so a failed install can't fall back to
  // fetching whatever Vite the registry serves.
  run(path.join(treeshakeDir, 'node_modules', '.bin', 'vite'), ['build'], {
    cwd: treeshakeDir
  });

  const outDir = path.join(treeshakeDir, 'dist');
  const bundleFiles = fs
    .readdirSync(outDir)
    .filter((file) => file.endsWith('.js'));
  // An empty bundle contains none of the forbidden markers, so without this
  // the leak check below would pass on no output at all.
  if (bundleFiles.length === 0) {
    throw new Error(`Vite emitted no .js files in ${outDir}`);
  }
  const bundle = bundleFiles
    .map((file) => fs.readFileSync(path.join(outDir, file), 'utf8'))
    .join('\n');
  if (!bundle.includes(required)) {
    throw new Error(
      `Vite's Button-only bundle does not contain ${required}: Button itself was dropped.`
    );
  }
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

  // esbuild picks entries by rules neither webpack nor Rollup share, and it is
  // what Vite's dev server pre-bundles dependencies with. It comes from the
  // same locked fixture as Vite.
  step('Verifying esbuild consumer (ESM for import-only graphs, single copy)');
  run('node', ['esbuild-checks.mjs'], { cwd: treeshakeDir });

  step('Verifying Next.js App Router consumer (Turbopack SSR, single copy)');
  run('node', ['next-checks.mjs'], { cwd: treeshakeDir });

  console.log('\n✓ Packaging validation passed');
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}
