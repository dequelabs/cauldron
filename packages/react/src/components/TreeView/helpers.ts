import { type Key, type Selection } from 'react-aria-components';
import { TreeViewNode, TreeViewSelectionStrategy } from './types';

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
  // "Select all" only includes selectable (non-locked) nodes.
  const locked = new Set<Key>(collectLockedKeys(nodes));
  return new Set<Key>(collectAllKeys(nodes).filter((key) => !locked.has(key)));
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

/** All ancestor ids of a node, from immediate parent up to the root. */
export function collectAncestorKeys(nodes: TreeViewNode[], key: Key): Key[] {
  const path: Key[] = [];
  const walk = (list: TreeViewNode[], trail: Key[]): boolean => {
    for (const node of list) {
      if (node.id === key) {
        path.push(...trail);
        return true;
      }
      if (node.children && walk(node.children, [...trail, node.id])) {
        return true;
      }
    }
    return false;
  };
  walk(nodes, []);
  return path;
}

/** Ids of all locked nodes (rendered disabled / non-selectable). */
export function collectLockedKeys(nodes: TreeViewNode[]): Key[] {
  return nodes.flatMap((node) => [
    ...(node.locked ? [node.id] : []),
    ...(node.children ? collectLockedKeys(node.children) : [])
  ]);
}

/**
 * Reconcile parent membership bottom-up: a parent is selected iff all of its
 * selectable (non-locked) descendants are selected. Locked nodes are never
 * selected and don't count toward (or block) a parent's checked state. A parent
 * whose subtree has no selectable nodes is left untouched. Mutates `selected`.
 */
function normalizeParentSelection(
  nodes: TreeViewNode[],
  selected: Set<Key>,
  locked: Set<Key>
): void {
  // Returns whether the subtree is fully selected (for an ancestor's check) and
  // whether it contains any selectable node at all.
  const visit = (
    node: TreeViewNode
  ): { full: boolean; selectable: boolean } => {
    if (locked.has(node.id)) {
      let selectable = false;
      node.children?.forEach((child) => {
        if (visit(child).selectable) {
          selectable = true;
        }
      });
      // Locked nodes never block an ancestor and are never added themselves.
      return { full: true, selectable };
    }
    if (!node.children || node.children.length === 0) {
      return { full: selected.has(node.id), selectable: true };
    }
    let full = true;
    let selectable = false;
    node.children.forEach((child) => {
      const result = visit(child);
      full = full && result.full;
      selectable = selectable || result.selectable;
    });
    // Only reconcile this parent when its subtree has something selectable.
    if (selectable) {
      if (full) {
        selected.add(node.id);
      } else {
        selected.delete(node.id);
      }
    }
    return { full, selectable };
  };
  nodes.forEach(visit);
}

/**
 * Toggle a single node's selection according to the strategy (multiple mode):
 * - `independent`: only the clicked node changes.
 * - `cascade`: the toggle applies to the node's whole subtree, then ancestors
 *   are reconciled (a parent is checked iff all its children are).
 * - `exclusive`: selecting a node clears its ancestors and descendants (parent
 *   and children are mutually exclusive); deselecting just clears the node.
 *
 * In `single` mode the strategy is ignored — only the clicked node is selected
 * (clicking it again clears it).
 */
export function toggleSelection(
  nodes: TreeViewNode[],
  previous: Set<Key>,
  key: Key,
  selectionMode: 'single' | 'multiple',
  strategy: TreeViewSelectionStrategy
): Set<Key> {
  if (selectionMode === 'single') {
    const result = new Set<Key>();
    if (!previous.has(key)) {
      result.add(key);
    }
    return result;
  }

  const result = new Set<Key>(previous);
  const selecting = !previous.has(key);

  if (strategy === 'independent') {
    if (selecting) {
      result.add(key);
    } else {
      result.delete(key);
    }
    return result;
  }

  if (strategy === 'exclusive') {
    if (!selecting) {
      result.delete(key);
      return result;
    }
    const node = findNode(nodes, key);
    const conflicts = [
      ...collectAncestorKeys(nodes, key),
      ...(node ? collectDescendantKeys(node) : [])
    ];
    conflicts.forEach((k) => result.delete(k));
    result.add(key);
    return result;
  }

  // cascade
  const locked = new Set<Key>(collectLockedKeys(nodes));
  const node = findNode(nodes, key);
  const subtree = node ? [key, ...collectDescendantKeys(node)] : [key];
  subtree.forEach((k) => {
    if (selecting) {
      if (!locked.has(k)) {
        result.add(k);
      }
    } else {
      result.delete(k);
    }
  });
  normalizeParentSelection(nodes, result, locked);
  return result;
}

/**
 * Apply react-aria's proposed selection while enforcing the parent/child
 * `strategy`. For each key react-aria added/removed, the corresponding subtree
 * (cascade) or ancestor/descendant conflicts (exclusive) are reconciled. For
 * `independent` — or any non-multiple mode — the proposed selection is used
 * as-is (react-aria already enforces single/none semantics).
 */
export function applySelectionChange(
  nodes: TreeViewNode[],
  previous: Set<Key>,
  next: Set<Key>,
  selectionMode: 'none' | 'single' | 'multiple',
  strategy: TreeViewSelectionStrategy
): Set<Key> {
  if (selectionMode !== 'multiple' || strategy === 'independent') {
    return next;
  }

  const result = new Set<Key>(previous);
  const added = [...next].filter((key) => !previous.has(key));
  const removed = [...previous].filter((key) => !next.has(key));

  if (strategy === 'exclusive') {
    removed.forEach((key) => result.delete(key));
    added.forEach((key) => {
      const node = findNode(nodes, key);
      const conflicts = [
        ...collectAncestorKeys(nodes, key),
        ...(node ? collectDescendantKeys(node) : [])
      ];
      conflicts.forEach((k) => result.delete(k));
      result.add(key);
    });
    return result;
  }

  // cascade
  const locked = new Set<Key>(collectLockedKeys(nodes));
  const apply = (key: Key, selecting: boolean) => {
    const node = findNode(nodes, key);
    const keys = node ? [key, ...collectDescendantKeys(node)] : [key];
    keys.forEach((k) => {
      if (selecting) {
        if (!locked.has(k)) {
          result.add(k);
        }
      } else {
        result.delete(k);
      }
    });
  };
  added.forEach((key) => apply(key, true));
  removed.forEach((key) => apply(key, false));
  normalizeParentSelection(nodes, result, locked);
  return result;
}

/**
 * Parents that are partially selected. A node is indeterminate when it has at
 * least one selected descendant but is not itself selected — which holds for
 * both the `cascade` and `exclusive` strategies. (Locked descendants are never
 * selected, so they never make a parent indeterminate.)
 */
export function computeIndeterminateKeys(
  nodes: TreeViewNode[],
  selected: Set<Key>
): Set<Key> {
  const indeterminate = new Set<Key>();
  const visit = (node: TreeViewNode): boolean => {
    if (!node.children || node.children.length === 0) {
      return selected.has(node.id);
    }
    let hasSelectedDescendant = false;
    node.children.forEach((child) => {
      if (visit(child)) {
        hasSelectedDescendant = true;
      }
    });
    if (hasSelectedDescendant && !selected.has(node.id)) {
      indeterminate.add(node.id);
    }
    return hasSelectedDescendant || selected.has(node.id);
  };
  nodes.forEach(visit);
  return indeterminate;
}
