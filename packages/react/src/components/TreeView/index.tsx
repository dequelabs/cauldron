import React, { forwardRef, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  Tree,
  Virtualizer,
  ListLayout,
  type Selection,
  type Key
} from 'react-aria-components';
import { Cauldron } from '../../types';
import { TreeViewNode } from './types';
import TreeViewItem from './TreeViewItem';
import {
  applyCascade,
  collectDisabledKeys,
  toggleSelection,
  toKeySet
} from './helpers';

export type { TreeViewNode } from './types';

/** Seeds the initial scroll math only; react-aria measures real row heights. */
const ESTIMATED_ROW_HEIGHT = 32;
/** Keep in step with `--space-quarter` / `--space-half`, which `.TreeView` uses
 *  for its flex spacing — see the spacing-parity test. */
export const ROW_GAP = 2;
export const LIST_PADDING = 4;

type TreeViewProps = Cauldron.LabelProps &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'role' | 'dangerouslySetInnerHTML'
  > & {
    items: TreeViewNode[];
    onAction?: (key: string) => void;
    selectionMode?: 'none' | 'single' | 'multiple';
    /** When true (multiple selection only), selecting a parent also selects all
     *  of its (non-disabled) descendants. */
    cascadeSelect?: boolean;
    /** When true (multiple selection only), deselecting a parent also deselects
     *  all of its descendants. */
    cascadeDeselect?: boolean;
    defaultExpandedKeys?: string[];
    /** Render only the rows in view. Use for long lists, where rendering every
     *  row makes selection changes slow enough to look frozen. Requires a
     *  `height`. Toggling this at runtime remounts the tree, which resets
     *  expansion and scroll position. */
    virtualized?: boolean;
    /** Height of the scroll region. Only applies when `virtualized` is set.
     *  A relative unit (`"20rem"`) keeps the visible row count stable at zoom. */
    height?: number | string;
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
      virtualized = false,
      height,
      className,
      style,
      ...other
    },
    ref
  ) => {
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

    // Disabled nodes are non-selectable; react-aria disables them via disabledKeys.
    const disabledKeys = useMemo(() => collectDisabledKeys(items), [items]);

    // Always control selection: react-aria's own state is lost if the tree
    // remounts (which toggling `virtualized` does), taking the user's checkboxes
    // with it.
    const selectionProps =
      selectionMode !== 'none'
        ? { selectedKeys, onSelectionChange: handleSelectionChange }
        : {};

    // The `height` prop outranks `style.height`: it is the more specific API and
    // the virtualizer sizes the scroll region from it.
    const mergedStyle = virtualized ? { ...style, height } : style;

    const tree = (
      <Tree
        ref={ref}
        className={classNames('TreeView', className, {
          'TreeView--virtualized': virtualized
        })}
        selectionMode={selectionMode}
        defaultExpandedKeys={defaultExpandedKeys}
        {...(disabledKeys.length > 0 ? { disabledKeys } : {})}
        {...(onAction ? { onAction: handleAction } : {})}
        {...selectionProps}
        {...other}
        style={mergedStyle}
      >
        {items.map((item) => (
          <TreeViewItem key={item.id} {...item} />
        ))}
      </Tree>
    );

    // Rows are absolutely positioned here, so the list layout owns their spacing
    // rather than `.TreeView`'s flex `gap`/`padding`.
    if (virtualized) {
      return (
        <Virtualizer
          layout={ListLayout}
          layoutOptions={{
            estimatedRowHeight: ESTIMATED_ROW_HEIGHT,
            gap: ROW_GAP,
            padding: LIST_PADDING
          }}
        >
          {tree}
        </Virtualizer>
      );
    }

    return tree;
  }
);

TreeView.displayName = 'TreeView';

export default TreeView;
