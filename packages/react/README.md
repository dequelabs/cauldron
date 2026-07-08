# Cauldron React

Friends don’t let friends ship inaccessible code! Cauldron is designed with accessibility in mind, including styles covering everything from typography to colors, and React components that are designed to be inclusive of all users. Additionally, Cauldron's React components are designed to include full screen reader and keyboard navigation support.

## Installation

To start using Cauldron React, install the packages with your package manager of choice:

### npm

```js
npm install @deque/cauldron-react @deque/cauldron-styles
```

### yarn

```js
yarn add @deque/cauldron-react @deque/cauldron-styles
```

## Getting Started

To get started, follow our [usage guide](https://cauldron.dequelabs.com/#usage) that includes setup instructions and necessary dependencies. Further documentation is also available at [cauldron.dequelabs.com](https://cauldron.dequelabs.com) that includes documentation for every available Cauldron component.

## Reducing bundle size

Cauldron React ships each component as its own module in addition to the top-level barrel. Importing from the barrel pulls the whole library into your bundle:

```js
// Pulls in every component (and their dependencies, e.g. react-aria-components).
import { Modal, Button } from '@deque/cauldron-react';
```

To only bundle the components you use, deep-import them via their subpath:

```js
// Only bundles Modal and Button (and what they actually depend on).
import Modal from '@deque/cauldron-react/Modal';
import Button from '@deque/cauldron-react/Button';
```

Named subcomponents remain available as named exports of the same subpath:

```js
import Modal, { ModalHeader, ModalContent } from '@deque/cauldron-react/Modal';
```

Each component's deep-import subpath (`@deque/cauldron-react/<ComponentName>`) maps to its directory under `src/components/`. These subpaths are a **stable, public part of the package contract**: renaming, moving, or removing a component directory changes a documented import path and is therefore a breaking change that must go through a major version bump.

> **TypeScript:** subpath types are resolved via the package `exports` map, which requires `moduleResolution` set to `"bundler"`, `"node16"`, or `"nodenext"`. Projects on the legacy `"node"` (`node10`) resolution will not find the deep-import type declarations (the imports still work at runtime) — use the barrel import for typed access on that setting.

## Attribution

Some Cauldron icons use Font Awesome Free and Font Awesome Pro. Their licenses can be found here: [Font Awesome Free License](https://fontawesome.com/license/free) and [Font Awesome Pro License](https://fontawesome.com/license).

## Contribute

If you're interested in contributing to Cauldron, you can check out our [contribution guide](https://github.com/dequelabs/cauldron/blob/develop/CONTRIBUTING.md) as well as our [code of conduct](https://github.com/dequelabs/cauldron/blob/develop/CODE_OF_CONDUCT.md).

Did you find a bug or have a feature request? [Open an issue!](https://github.com/dequelabs/cauldron/issues/new/choose)
