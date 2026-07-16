// Smoke test: the packed tarball resolves under native ESM `import`.
// Runs inside a throwaway consumer where the tarball is installed (not the
// workspace symlink), so this exercises the real published resolution.
import assert from 'node:assert';

// The barrel is named-exports only (no default). Under the ESM condition this
// is real ESM, so exercise named + namespace imports — a `default` import would
// (correctly) fail.
import * as cauldron from '@deque/cauldron-react';
import { Button, Modal } from '@deque/cauldron-react';

assert(Button, 'import: expected `Button` named export');
assert(Modal, 'import: expected `Modal` named export');
assert(cauldron.Button, 'import: expected `Button` on the namespace');
assert(
  typeof Button === 'object' || typeof Button === 'function',
  'import: `Button` is not a renderable component'
);

console.log('import "@deque/cauldron-react" OK');
