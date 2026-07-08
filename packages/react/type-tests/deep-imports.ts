/**
 * Type-resolution fixture for the per-component deep-import contract
 * (dequelabs/cauldron#2465). Compiled with `moduleResolution: "bundler"` (see
 * the sibling tsconfig.json) so TypeScript honors the package.json `exports`
 * `types` condition the way a real consumer's bundler does — which the
 * package's own `node`-resolution typecheck does not exercise.
 *
 * If a component's `types` subpath stops resolving (a dropped `.d.ts`, an
 * exports-map drift, or a missing default export), `tsc` fails here with
 * "Cannot find module … or its corresponding type declarations", so the
 * contract breaks in CI instead of in a consumer's editor.
 */

// Inline component: default + named subcomponents.
import Modal, { ModalHeader, ModalContent } from '@deque/cauldron-react/Modal';
// Re-export barrel that emits no runtime index.js without the entry-point fix.
import Table, { TableBody } from '@deque/cauldron-react/Table';
// Component that gained a default export so the default-import pattern is uniform.
import Address, { AddressLine } from '@deque/cauldron-react/Address';
// The top-level barrel must still resolve as a named-export module.
import { Button } from '@deque/cauldron-react';

// Reference every binding so resolution is exercised under strict settings.
export const deepImports = {
  Modal,
  ModalHeader,
  ModalContent,
  Table,
  TableBody,
  Address,
  AddressLine,
  Button
};
