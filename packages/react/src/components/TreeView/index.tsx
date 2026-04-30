import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';
import { Tree, type Selection, type Key } from 'react-aria-components';
import { Cauldron } from '../../types';
import { TreeViewNode } from './types';
import TreeViewItem from './TreeViewItem';

export type { TreeViewNode } from './types';

type TreeViewProps = Cauldron.LabelProps & {
  items: TreeViewNode[];
  onAction?: (key: string) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
  className?: string;
};

function collectAllKeys(nodes: TreeViewNode[]): Key[] {
  return nodes.flatMap((node) => [
    node.id,
    ...(node.children ? collectAllKeys(node.children) : [])
  ]);
}

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      items,
      onAction,
      selectionMode = 'none',
      defaultExpandedKeys,
      className,
      ...other
    },
    ref
  ) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    const handleAction = (key: Key) => {
      setSelectedKeys((prev) => {
        const prevSet =
          prev === 'all' ? new Set<Key>(collectAllKeys(items)) : new Set(prev);
        const next = new Set(prevSet);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (selectionMode === 'single') {
            next.clear();
          }
          next.add(key);
        }
        return next;
      });
      onAction?.(key as string);
    };

    const actionProps = onAction
      ? {
          onAction: handleAction,
          selectedKeys,
          onSelectionChange: setSelectedKeys
        }
      : {};

    return (
      <Tree
        ref={ref}
        className={classNames('TreeView', className)}
        selectionMode={selectionMode}
        defaultExpandedKeys={defaultExpandedKeys}
        {...actionProps}
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
