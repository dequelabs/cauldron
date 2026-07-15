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
 *
 * The smoke consumer installs from the tarball (not a workspace symlink), so
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
      '--no-package-lock'
    ],
    { cwd: consumerDir }
  );
  run('node', ['smoke.cjs'], { cwd: consumerDir });
  run('node', ['smoke.mjs'], { cwd: consumerDir });

  console.log('\n✓ Packaging validation passed');
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}
