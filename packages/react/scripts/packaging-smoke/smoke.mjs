// Smoke test: the packed tarball resolves under native ESM `import`.
// Runs inside a throwaway consumer where the tarball is installed (not the
// workspace symlink), so this exercises the real published resolution.
import assert from 'node:assert';

import { Button, Modal } from '@deque/cauldron-react';

assert(Button, 'import: expected `Button` named export');
assert(Modal, 'import: expected `Modal` named export');
assert(
  typeof Button === 'object' || typeof Button === 'function',
  'import: `Button` is not a renderable component'
);

console.log('import "@deque/cauldron-react" OK');
