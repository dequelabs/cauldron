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

/** Estimated row height (px) handed to the virtualizer. react-aria measures the
 *  real height of each row after mount, so this only needs to be close enough
 *  to seed the initial scroll math — wrapped multi-line rows are handled. */
const ESTIMATED_ROW_HEIGHT = 32;
/** Matches `.TreeView` `gap: var(--space-quarter)` (2px) so virtualized and
 *  non-virtualized rows sit the same distance apart. */
const ROW_GAP = 2;
/** Matches `.TreeView` `padding: var(--space-half)` (4px) so the virtualized
 *  scroll content has the same outer padding as the non-virtualized tree. */
const LIST_PADDING = 4;

type TreeViewProps = Cauldron.LabelProps &
  React.HTMLAttributes<HTMLDivElement> & {
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
    /** When set to a non-zero value, the tree becomes a fixed-height scroll
     *  region and only the rows in view are rendered (virtualized). Use for long
     *  lists where rendering every row makes selection changes take a long time
     *  while appearing to freeze. Omit (or pass `0`) for the default behavior
     *  where the tree grows to fit all rows.
     *  Accepts any CSS height value. Treat this as a *stable* prop: toggling it
     *  between set and unset at runtime remounts the underlying tree, which resets
     *  uncontrolled expansion and scroll/focus position. */
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
      height,
      className,
      ...other
    },
    ref
  ) => {
    // A zero height would produce an empty, collapsed scroll region that renders
    // no rows, so treat `0` (a common "not measured yet" value from layout code)
    // the same as unset and fall back to the grow-to-fit tree. Layout code that
    // interpolates a measurement into a template string yields a value like
    // `"0px"` before the element is measured, so normalize string zeros too.
    const isZeroHeight =
      height === 0 || (typeof height === 'string' && parseFloat(height) === 0);
    const isVirtualized = height !== undefined && !isZeroHeight;
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

    // Cascade requires controlling selection. Without it, preserve the original
    // behavior: selection is only controlled when an `onAction` handler is set.
    const selectionProps =
      selectionMode !== 'none' && (isCascade || onAction)
        ? { selectedKeys, onSelectionChange: handleSelectionChange }
        : {};

    // Merge the virtualization height into any caller-supplied `style` (which
    // arrives via the `...other` passthrough) rather than letting it clobber, or
    // be clobbered by, the height. Applied after `{...other}` so height wins.
    const virtualizedStyle = isVirtualized
      ? { ...other.style, height }
      : undefined;

    const tree = (
      <Tree
        ref={ref}
        className={classNames('TreeView', className, {
          'TreeView--virtualized': isVirtualized
        })}
        selectionMode={selectionMode}
        defaultExpandedKeys={defaultExpandedKeys}
        {...(disabledKeys.length > 0 ? { disabledKeys } : {})}
        {...(onAction ? { onAction: handleAction } : {})}
        {...selectionProps}
        {...other}
        {...(virtualizedStyle ? { style: virtualizedStyle } : {})}
      >
        {items.map((item) => (
          <TreeViewItem key={item.id} {...item} />
        ))}
      </Tree>
    );

    // When a height is provided, virtualize: only the rows in view are rendered
    // to the DOM, so selection changes no longer reconcile the whole list. The
    // list layout owns row spacing/padding here (see `.TreeView--virtualized`
    // in the styles), because virtualized rows are absolutely positioned and
    // the container's flex `gap`/`padding` no longer apply.
    if (isVirtualized) {
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
