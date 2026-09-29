// Exercises the ESM build specifically.
//
// `smoke.mjs` imports the bare specifier, which Node resolves to the CJS build
// at `lib/` — only bundlers take the `module` condition to lib/esm. The exports
// map blocks lib/esm as a specifier, so this fixture imports it by file path.
//
// Two failure modes it catches:
//   * A `default` import of an `__esModule`-shipping CJS dependency left
//     un-unwrapped. Under strict ESM the value is the wrapper, so Code's
//     module-scope `SyntaxHighlighter.registerLanguage(...)` throws at import
//     time and takes the whole barrel down.
//   * The same omission on `react-id-generator`, which throws at *render* time
//     ("nextId is not a function") rather than import time — so importing the
//     barrel is not enough, the components have to actually render.
import assert from 'node:assert';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(
  require.resolve('@deque/cauldron-react/package.json')
);
const esmEntry = pathToFileURL(
  path.join(packageRoot, 'lib', 'esm', 'index.js')
).href;

// Importing the barrel runs Code's module-scope registerLanguage calls.
const lib = await import(esmEntry);

for (const name of ['Button', 'Code', 'Checkbox', 'TreeView', 'ThemeContext']) {
  assert(lib[name], `esm: expected \`${name}\` named export from lib/esm`);
}

const { Code, Checkbox, TreeView } = lib;

// Code: exercises the unwrapped react-syntax-highlighter defaults at render.
// Code sets `useInlineStyles={false}`, so a registered grammar shows up as
// `hljs-*` token classes; an unregistered language renders plain text. One
// sample per language Code registers, each with a token only that grammar emits.
for (const [language, source, token] of [
  ['javascript', 'const a = 1;', 'hljs-keyword'],
  ['css', 'a { color: red; }', 'hljs-selector-tag'],
  ['html', '<a href="x">y</a>', 'hljs-tag'],
  ['yaml', 'key: value', 'hljs-attr']
]) {
  const codeMarkup = renderToStaticMarkup(
    React.createElement(Code, { language }, source)
  );
  assert(
    codeMarkup.includes(token),
    `esm: Code rendered no ${token} for ${language}, so the grammar is not ` +
      `registered (got: ${codeMarkup.slice(0, 120)})`
  );
}

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
  treeMarkup.includes('tree-view-item-'),
  'esm: TreeViewItem did not render the checkbox id minted by nextId'
);

console.log(
  'esm-output OK: lib/esm imports and renders interop-sensitive components'
);
