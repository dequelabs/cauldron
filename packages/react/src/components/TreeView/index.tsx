import React, { forwardRef, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Tree, type Selection, type Key } from 'react-aria-components';
import { Cauldron } from '../../types';
import { TreeViewNode, TreeViewSelectionStrategy } from './types';
import TreeViewItem from './TreeViewItem';
import TreeViewContext from './TreeViewContext';
import {
  applySelectionChange,
  collectLockedKeys,
  computeIndeterminateKeys,
  toggleSelection,
  toKeySet
} from './helpers';

export type { TreeViewNode, TreeViewSelectionStrategy } from './types';

type TreeViewProps = Cauldron.LabelProps & {
  items: TreeViewNode[];
  onAction?: (key: string) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  /**
   * How selecting a node relates to its parent/children (multiple selection only):
   * - `independent` (default): nodes are selected independently of one another.
   * - `cascade`: selecting a parent selects all descendants; a parent reflects
   *   its descendants — checked when all are selected, indeterminate when some.
   * - `exclusive`: a parent and its children are mutually exclusive — selecting a
   *   node clears its ancestors and descendants. A parent shows the indeterminate
   *   (dash) state while any descendant is selected.
   */
  selectionStrategy?: TreeViewSelectionStrategy;
  defaultExpandedKeys?: string[];
  className?: string;
};

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      items,
      onAction,
      selectionMode = 'none',
      selectionStrategy = 'independent',
      defaultExpandedKeys,
      className,
      ...other
    },
    ref
  ) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    // Parent/child linkage (and the indeterminate display) only apply to
    // multiple selection with a non-independent strategy.
    const isLinked =
      selectionMode === 'multiple' && selectionStrategy !== 'independent';

    // Selection driven by react-aria (row/checkbox press, keyboard). When the
    // strategy links parents and children, reconcile the proposed change;
    // otherwise store the selection as react-aria proposes it.
    const handleSelectionChange = (selection: Selection) => {
      setSelectedKeys((prev) =>
        applySelectionChange(
          items,
          toKeySet(prev, items),
          toKeySet(selection, items),
          selectionMode,
          selectionStrategy
        )
      );
    };

    // When `onAction` is set, react-aria treats a row press as an action rather
    // than a selection, so we toggle selection here ourselves.
    const handleAction = (key: Key) => {
      if (selectionMode !== 'none') {
        setSelectedKeys((prev) =>
          toggleSelection(
            items,
            toKeySet(prev, items),
            key,
            selectionMode,
            selectionStrategy
          )
        );
      }
      onAction?.(key as string);
    };

    const indeterminateKeys = useMemo(
      () =>
        isLinked
          ? computeIndeterminateKeys(items, toKeySet(selectedKeys, items))
          : new Set<Key>(),
      [items, selectedKeys, isLinked]
    );

    // Locked nodes are non-selectable; react-aria disables them via disabledKeys.
    const disabledKeys = useMemo(() => collectLockedKeys(items), [items]);

    // Linked strategies require controlling selection so parent/child state can be
    // derived. For `independent`, preserve the original behavior: selection is
    // only controlled when an `onAction` handler is present.
    const selectionProps =
      selectionMode === 'none'
        ? {}
        : isLinked || onAction
          ? { selectedKeys, onSelectionChange: handleSelectionChange }
          : {};

    return (
      <TreeViewContext.Provider value={{ indeterminateKeys }}>
        <Tree
          ref={ref}
          className={classNames('TreeView', className)}
          selectionMode={selectionMode}
          defaultExpandedKeys={defaultExpandedKeys}
          {...(disabledKeys.length > 0 ? { disabledKeys } : {})}
          {...(onAction ? { onAction: handleAction } : {})}
          {...selectionProps}
          {...other}
        >
          {items.map((item) => (
            <TreeViewItem key={item.id} {...item} />
          ))}
        </Tree>
      </TreeViewContext.Provider>
    );
  }
);

TreeView.displayName = 'TreeView';

export default TreeView;
