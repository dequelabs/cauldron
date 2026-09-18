// Exercises the ESM build specifically.
//
// `smoke.mjs` imports the bare specifier, which Node resolves through `main` to
// the CJS tree at `lib/` — it never loads lib/esm, because Node does not read
// the `module` field. So the ESM half of the dual build has no executing
// coverage unless we import it by path, which is what this fixture does.
//
// Two failure modes it catches, both of which shipped on this branch before
// being fixed:
//   * A `default` import of an `__esModule`-shipping CJS dependency left
//     un-unwrapped. Under strict ESM the value is the wrapper, so Code's
//     module-scope `SyntaxHighlighter.registerLanguage(...)` throws at import
//     time and takes the whole barrel down.
//   * The same omission on `react-id-generator`, which throws at *render* time
//     ("nextId is not a function") rather than import time — so importing the
//     barrel is not enough, the components have to actually render.
import assert from 'node:assert';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const esmEntry = require.resolve('@deque/cauldron-react/lib/esm/index.js');

// Importing the barrel runs Code's module-scope registerLanguage calls.
const lib = await import(esmEntry);

for (const name of ['Button', 'Code', 'Checkbox', 'TreeView', 'ThemeContext']) {
  assert(lib[name], `esm: expected \`${name}\` named export from lib/esm`);
}

const { Code, Checkbox, TreeView } = lib;

// Code: exercises the unwrapped react-syntax-highlighter default at render.
const codeMarkup = renderToStaticMarkup(
  React.createElement(Code, { language: 'javascript' }, 'const a = 1;')
);
assert(
  codeMarkup.includes('const') && codeMarkup.includes('<pre'),
  `esm: Code rendered no highlighted <pre> (got: ${codeMarkup.slice(0, 120)})`
);

// Checkbox: exercises the unwrapped react-id-generator default at render.
const checkboxMarkup = renderToStaticMarkup(
  React.createElement(Checkbox, { id: 'esm-checkbox', label: 'Accept' })
);
assert(
  checkboxMarkup.includes('esm-checkbox'),
  'esm: Checkbox did not render its input'
);

// TreeView with multiple selection renders TreeViewItem, the second
// react-id-generator call site, which mints its own checkbox id.
const treeMarkup = renderToStaticMarkup(
  React.createElement(TreeView, {
    'aria-label': 'Files',
    selectionMode: 'multiple',
    items: [{ id: 'root', textValue: 'Root' }]
  })
);
assert(
  treeMarkup.includes('Root'),
  'esm: TreeView did not render its item text'
);

console.log(
  'esm-output OK: lib/esm imports and renders interop-sensitive components'
);
