import { type Key, type Selection } from 'react-aria-components';
import { TreeViewNode } from './types';

/** Every node id in the tree, flattened depth-first. */
export function collectAllKeys(nodes: TreeViewNode[]): Key[] {
  return nodes.flatMap((node) => [
    node.id,
    ...(node.children ? collectAllKeys(node.children) : [])
  ]);
}

/** Normalize react-aria's `Selection` ("all" | Set) into a concrete Set of keys. */
export function toKeySet(
  selection: Selection,
  nodes: TreeViewNode[]
): Set<Key> {
  if (selection !== 'all') {
    return new Set<Key>(selection);
  }
  // "Select all" only includes selectable (non-disabled) nodes.
  const disabled = new Set<Key>(collectDisabledKeys(nodes));
  return new Set<Key>(
    collectAllKeys(nodes).filter((key) => !disabled.has(key))
  );
}

/** Locate a node anywhere in the tree by its id. */
export function findNode(
  nodes: TreeViewNode[],
  key: Key
): TreeViewNode | undefined {
  for (const node of nodes) {
    if (node.id === key) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, key);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/** All descendant ids of a node (not including the node itself). */
export function collectDescendantKeys(node: TreeViewNode): Key[] {
  if (!node.children) {
    return [];
  }
  return node.children.flatMap((child) => [
    child.id,
    ...collectDescendantKeys(child)
  ]);
}

/** Ids of all disabled nodes (rendered disabled / non-selectable). */
export function collectDisabledKeys(nodes: TreeViewNode[]): Key[] {
  return nodes.flatMap((node) => [
    ...(node.disabled ? [node.id] : []),
    ...(node.children ? collectDisabledKeys(node.children) : [])
  ]);
}

interface CascadeOptions {
  cascadeSelect: boolean;
  cascadeDeselect: boolean;
}

/**
 * Toggle a single node, applying cascade per the options (multiple mode only):
 * - selecting + `cascadeSelect`: also selects all (non-disabled) descendants.
 * - deselecting + `cascadeDeselect`: also deselects all descendants.
 *
 * In `single` mode only the clicked node is selected (clicking it again clears
 * it); cascade does not apply.
 */
export function toggleSelection(
  nodes: TreeViewNode[],
  previous: Set<Key>,
  key: Key,
  selectionMode: 'single' | 'multiple',
  { cascadeSelect, cascadeDeselect }: CascadeOptions
): Set<Key> {
  if (selectionMode === 'single') {
    const result = new Set<Key>();
    if (!previous.has(key)) {
      result.add(key);
    }
    return result;
  }

  const result = new Set<Key>(previous);
  const node = findNode(nodes, key);
  const descendants = node ? collectDescendantKeys(node) : [];
  const disabled = new Set<Key>(collectDisabledKeys(nodes));

  if (!previous.has(key)) {
    result.add(key);
    if (cascadeSelect) {
      descendants.forEach((k) => {
        if (!disabled.has(k)) {
          result.add(k);
        }
      });
    }
  } else {
    result.delete(key);
    if (cascadeDeselect) {
      descendants.forEach((k) => result.delete(k));
    }
  }
  return result;
}

/**
 * Apply react-aria's proposed selection while enforcing cascade. Each key
 * react-aria added cascades to its descendants when `cascadeSelect` is set; each
 * key it removed cascades when `cascadeDeselect` is set. In non-multiple modes
 * (or with both toggles off) the proposed selection is used as-is.
 */
export function applyCascade(
  nodes: TreeViewNode[],
  previous: Set<Key>,
  next: Set<Key>,
  selectionMode: 'none' | 'single' | 'multiple',
  { cascadeSelect, cascadeDeselect }: CascadeOptions
): Set<Key> {
  if (selectionMode !== 'multiple' || (!cascadeSelect && !cascadeDeselect)) {
    return next;
  }

  const result = new Set<Key>(previous);
  const added = [...next].filter((key) => !previous.has(key));
  const removed = [...previous].filter((key) => !next.has(key));
  const disabled = new Set<Key>(collectDisabledKeys(nodes));

  added.forEach((key) => {
    result.add(key);
    if (cascadeSelect) {
      const node = findNode(nodes, key);
      (node ? collectDescendantKeys(node) : []).forEach((k) => {
        if (!disabled.has(k)) {
          result.add(k);
        }
      });
    }
  });

  removed.forEach((key) => {
    result.delete(key);
    if (cascadeDeselect) {
      const node = findNode(nodes, key);
      (node ? collectDescendantKeys(node) : []).forEach((k) =>
        result.delete(k)
      );
    }
  });

  return result;
}
