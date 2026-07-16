// Tree-shaking fixture: import ONLY Button. If the package is tree-shakeable,
// a production bundler must drop Code, react-syntax-highlighter,
// react-aria-components, and every other component from the output.
import { Button } from '@deque/cauldron-react';

// Reference it so it isn't dead-code-eliminated as an unused import.
export default Button;
