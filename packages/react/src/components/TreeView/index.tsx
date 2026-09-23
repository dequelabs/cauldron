import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Tree, type Selection, type Key } from 'react-aria-components';
import { Cauldron } from '../../types';
import { TreeViewNode } from './types';
import TreeViewItem from './TreeViewItem';
import useSharedRef from '../../utils/useSharedRef';
import {
  applyCascade,
  collectDisabledKeys,
  toggleSelection,
  toKeySet
} from './helpers';

export type { TreeViewNode } from './types';

type TreeViewProps = Cauldron.LabelProps & {
  items: TreeViewNode[];
  /** Runs when an item is activated: Enter, or a row press. Selection is a
   *  separate interaction — Space toggles it. */
  onAction?: (key: string) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  /** When true (multiple selection only), selecting a parent also selects all
   *  of its (non-disabled) descendants. */
  cascadeSelect?: boolean;
  /** When true (multiple selection only), deselecting a parent also deselects
   *  all of its descendants. */
  cascadeDeselect?: boolean;
  defaultExpandedKeys?: string[];
  className?: string;
};

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      items,
      onAction,
      selectionMode = 'none',
      cascadeSelect = false,
      cascadeDeselect = false,
      defaultExpandedKeys,
      className,
      ...other
    },
    ref
  ) => {
    const treeRef = useSharedRef<HTMLDivElement>(ref);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const cascade = { cascadeSelect, cascadeDeselect };
    // Cascade only applies to multiple selection.
    const isCascade =
      selectionMode === 'multiple' && (cascadeSelect || cascadeDeselect);

    // Selection driven by react-aria (row/checkbox press, keyboard). When
    // cascading, reconcile the proposed change; otherwise store react-aria's
    // selection as-is so the `'all'` sentinel (Ctrl+A) is preserved.
    const handleSelectionChange = (selection: Selection) => {
      setSelectedKeys((prev) =>
        isCascade
          ? applyCascade(
              items,
              toKeySet(prev, items),
              toKeySet(selection, items),
              selectionMode,
              cascade
            )
          : selection
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
            cascade
          )
        );
      }
      onAction?.(key as string);
    };

    // Space selects and Enter runs the action, consistently. react-aria only
    // treats a press as an action while nothing is selected, so once a row is
    // checked its Enter handling goes inert. Capture phase, so react-aria never
    // sees the key and cannot vary the outcome.
    useEffect(() => {
      const node = treeRef.current;
      if (!node || !onAction) return;

      const handleEnter = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' || event.defaultPrevented) return;
        const row = (event.target as HTMLElement | null)?.closest?.(
          '[role="row"][data-key]'
        );
        const key = row?.getAttribute('data-key');
        if (!key || row?.getAttribute('aria-disabled') === 'true') return;
        event.preventDefault();
        event.stopPropagation();
        onAction(key);
      };

      node.addEventListener('keydown', handleEnter, true);
      return () => node.removeEventListener('keydown', handleEnter, true);
    }, [onAction]);

    // Disabled nodes are non-selectable; react-aria disables them via disabledKeys.
    const disabledKeys = useMemo(() => collectDisabledKeys(items), [items]);

    // Cascade requires controlling selection. Without it, preserve the original
    // behavior: selection is only controlled when an `onAction` handler is set.
    const selectionProps =
      selectionMode !== 'none' && (isCascade || onAction)
        ? { selectedKeys, onSelectionChange: handleSelectionChange }
        : {};

    return (
      <Tree
        ref={treeRef}
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
    );
  }
);

TreeView.displayName = 'TreeView';

export default TreeView;
