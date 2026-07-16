/**
 * Adds explicit file extensions to relative imports in the ESM build's `.d.ts`
 * files.
 *
 * TypeScript emits declarations using the source's classic `moduleResolution:
 * node`, so relative specifiers are extensionless (`from './components/Button'`).
 * The ESM output carries a `{"type":"module"}` marker, and under
 * `moduleResolution: node16`/`nodenext` a consumer resolves those declarations
 * with ESM rules — where extensionless relative imports are an error. The
 * runtime `.js` already has correct extensions (Rollup adds them); this brings
 * the `.d.ts` in line so types resolve cleanly for node16-from-ESM consumers.
 *
 * Only `lib/esm` is processed: the `lib/cjs` declarations are resolved with
 * CommonJS rules, which infer the extension.
 */
const fs = require('node:fs');
const path = require('node:path');

const esmDir = path.join(__dirname, '..', 'lib', 'esm');

// `from '<spec>'`, `import('<spec>')`, and `export ... from '<spec>'` all match.
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*)(['"])(\.\.?\/[^'"]*)\2/g;

/** Resolve an extensionless relative specifier to its emitted `.js` path. */
function withExtension(fromFileDir, specifier) {
  if (/\.(js|mjs|cjs|json|css)$/.test(specifier)) {
    return null; // already explicit
  }
  const resolved = path.resolve(fromFileDir, specifier);
  if (fs.existsSync(`${resolved}.d.ts`)) {
    return `${specifier}.js`;
  }
  if (fs.existsSync(path.join(resolved, 'index.d.ts'))) {
    return `${specifier}/index.js`;
  }
  return null; // external or unresolved — leave untouched
}

function processFile(file) {
  const source = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  let changed = false;

  const output = source.replace(
    SPECIFIER,
    (match, prefix, quote, specifier) => {
      const rewritten = withExtension(dir, specifier);
      if (!rewritten) {
        return match;
      }
      changed = true;
      return `${prefix}${quote}${rewritten}${quote}`;
    }
  );

  if (changed) {
    fs.writeFileSync(file, output);
  }
  return changed;
}

function walk(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walk(full);
    } else if (entry.name.endsWith('.d.ts')) {
      count += processFile(full) ? 1 : 0;
    }
  }
  return count;
}

if (!fs.existsSync(esmDir)) {
  console.error(`Missing ESM build at ${esmDir}. Run the rollup build first.`);
  process.exit(1);
}

const changed = walk(esmDir);
console.log('Added ESM declaration extensions in %d file(s)', changed);
