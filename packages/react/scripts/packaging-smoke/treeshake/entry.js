// Tree-shaking fixture: import ONLY Button. If the package is tree-shakeable,
// a production bundler must drop every other component. verifyPackaging.js
// checks that with markers for the heavy dependencies (Code's highlighter
// graph, react-aria-components) and for a sample of unrelated components.
import { Button } from '@deque/cauldron-react';

// Reference it so it isn't dead-code-eliminated as an unused import.
export default Button;
