/**
 * Verifies the per-component deep-import contract advertised by the package
 * `exports` map (the `./*` subpath, see dequelabs/cauldron#2465).
 *
 * For every `src/components/<Name>/index.{ts,tsx}` this asserts that:
 *   - `@deque/cauldron-react/<Name>` resolves through the `exports` map to a
 *     real emitted `lib/components/<Name>/index.js` (the runtime condition),
 *   - requiring it yields at least one export, and
 *   - the sibling `index.d.ts` (the `types` condition target) exists on disk.
 *
 * Rollup `preserveModules` silently elides pure re-export barrels, so a
 * component can pass typecheck (tsc still emits `index.d.ts`) while its runtime
 * `index.js` is absent and the subpath 404s. This runs after `build:lib` so
 * that drift fails CI instead of shipping a broken import to consumers.
 *
 * Must run against the BUILT package (after `pnpm build:lib`).
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { componentDirEntries } = require('./componentDirs');

const { name: pkgName } = require('../package.json');
const COMPONENTS_ROOT = path.join(__dirname, '..', 'src', 'components');
const LIB_COMPONENTS = path.join(__dirname, '..', 'lib', 'components');

assert(
  fs.existsSync(LIB_COMPONENTS),
  `Expected built output at ${LIB_COMPONENTS} — run \`pnpm build:lib\` first.`
);

const componentNames = componentDirEntries(COMPONENTS_ROOT).map(
  (entry) => entry.name
);

const failures = [];

for (const name of componentNames) {
  const subpath = `${pkgName}/${name}`;
  try {
    // Resolves the `default` condition through the exports map; throws
    // ERR_PACKAGE_PATH_NOT_EXPORTED or MODULE_NOT_FOUND if the facade is absent.
    require.resolve(subpath);
    const mod = require(subpath);
    // The README documents the default import (`import X from '.../X'`) as the
    // deep-import pattern for every component, so a present-but-default-less
    // module (a future named-only addition) is a broken contract, not a pass.
    assert(
      Object.prototype.hasOwnProperty.call(mod, 'default'),
      `${subpath} has no default export — the documented \`import X from '${subpath}'\` pattern would resolve to undefined`
    );

    // The `types` condition advertises `./lib/components/<Name>/index.d.ts`.
    const dts = path.join(LIB_COMPONENTS, name, 'index.d.ts');
    assert(fs.existsSync(dts), `${subpath} is missing its types at ${dts}`);
  } catch (err) {
    failures.push(`${subpath}: ${err.message}`);
  }
}

// The barrel entry must also resolve.
try {
  require.resolve(pkgName);
} catch (err) {
  failures.push(`${pkgName} (barrel): ${err.message}`);
}

// Components under internal/ must NOT be reachable via the `./*` subpath — the
// `./internal` and `./internal/*` exports entries keep that boundary private.
// Assert the bare specifier and every built internal component are blocked so
// the boundary can't silently reopen (e.g. if someone adds an internal barrel).
const INTERNAL_ROOT = path.join(COMPONENTS_ROOT, 'internal');
const assertBlocked = (subpath, reason) => {
  try {
    require.resolve(subpath);
    failures.push(`${subpath}: ${reason}`);
  } catch (err) {
    if (err.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
      failures.push(`${subpath}: unexpected error ${err.code}: ${err.message}`);
    }
  }
};

assertBlocked(
  `${pkgName}/internal`,
  'bare internal specifier is publicly resolvable'
);
if (fs.existsSync(INTERNAL_ROOT)) {
  for (const { name } of componentDirEntries(INTERNAL_ROOT)) {
    assertBlocked(
      `${pkgName}/internal/${name}`,
      'internal component is publicly resolvable'
    );
  }
}

if (failures.length > 0) {
  console.error(
    `verifyExports: ${failures.length} deep-import subpath(s) are broken:\n` +
      failures.map((f) => `  - ${f}`).join('\n')
  );
  process.exit(1);
}

console.log(
  `verifyExports: all ${componentNames.length} component subpaths resolve at runtime and expose types.`
);
