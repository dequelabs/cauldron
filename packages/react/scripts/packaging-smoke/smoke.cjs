// Smoke test: the packed tarball resolves under CommonJS `require`.
// Runs inside a throwaway consumer where the tarball is installed (not the
// workspace symlink), so this exercises the real published resolution.
const assert = require('node:assert');

const cauldron = require('@deque/cauldron-react');

assert(cauldron.Button, 'require: expected `Button` named export');
assert(cauldron.Modal, 'require: expected `Modal` named export');
assert(
  typeof cauldron.Button === 'object' || typeof cauldron.Button === 'function',
  'require: `Button` is not a renderable component'
);

console.log('require("@deque/cauldron-react") OK');
