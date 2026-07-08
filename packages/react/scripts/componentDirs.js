/**
 * Single source of truth for "what is a component directory" — the mapping the
 * whole per-component deep-import feature (dequelabs/cauldron#2465) rests on.
 *
 * A component is a direct child directory of `src/components/` that has an
 * `index.tsx` or `index.ts`. Rollup turns each into a build entry point,
 * verifyExports asserts each resolves through the package `exports` map, and the
 * type-test generator imports each — so all three MUST agree on the set. Keeping
 * the scan here prevents the emitter and its guards from silently diverging.
 *
 * CommonJS so it can be `require`d by the CJS scripts and imported (via default
 * interop) by the ESM-loaded rollup.config.js.
 */
const fs = require('fs');
const path = require('path');

const INDEX_FILES = ['index.tsx', 'index.ts'];

/**
 * @param {string} componentsRoot absolute or cwd-relative path to a components dir
 * @returns {Array<{name: string, indexFile: string}>} one entry per component
 *   directory that has an index file, sorted by name for deterministic output.
 */
function componentDirEntries(componentsRoot) {
  return fs
    .readdirSync(componentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const indexFile = INDEX_FILES.map((file) =>
        path.join(componentsRoot, entry.name, file)
      ).find((file) => fs.existsSync(file));
      return indexFile ? { name: entry.name, indexFile } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { componentDirEntries };
