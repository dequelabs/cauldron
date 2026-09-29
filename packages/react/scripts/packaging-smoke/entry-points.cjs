// Runtime entry points of the packed tarball, under Node's resolver.
//
// The package root and the stylesheet are the only supported runtime imports.
// Every other file under lib/ must be unreachable, so consumers cannot come to
// depend on the layout of lib/esm (one file per source module) or the CJS
// bundle's internal chunks. Paths under lib/components and lib/types stay
// exported for type imports only, which Node refuses at runtime.
const assert = require('node:assert');

const supported = {
  '@deque/cauldron-react': /\/lib\/index\.js$/,
  '@deque/cauldron-react/lib/cauldron.css': /\/lib\/cauldron\.css$/,
  '@deque/cauldron-react/package.json': /\/package\.json$/
};

const blocked = [
  '@deque/cauldron-react/lib/index.js',
  '@deque/cauldron-react/lib/esm/index.js',
  '@deque/cauldron-react/lib/esm/components/Button/index.js',
  '@deque/cauldron-react/lib/components/Button',
  '@deque/cauldron-react/lib/types',
  '@deque/cauldron-react/lib/add-user.js'
];

(async () => {
  for (const [specifier, target] of Object.entries(supported)) {
    const resolved = require.resolve(specifier);
    assert.match(
      resolved,
      target,
      `${specifier} resolved to ${resolved}, not the expected file`
    );
  }

  for (const specifier of blocked) {
    assert.throws(
      () => require.resolve(specifier),
      { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' },
      `require('${specifier}') resolved, but only the package root and the ` +
        'stylesheet are supported runtime entries'
    );
    await assert.rejects(
      import(specifier),
      { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' },
      `import('${specifier}') resolved, but only the package root and the ` +
        'stylesheet are supported runtime entries'
    );
  }

  console.log(
    `entry-points OK: ${Object.keys(supported).length} supported, ` +
      `${blocked.length} internal paths blocked`
  );
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
