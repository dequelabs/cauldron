import React, { useState } from 'react';
import { Tree, type Selection, type Key } from 'react-aria-components';
import TreeViewItem from './TreeViewItem';

export interface TreeViewNode {
  id: string;
  textValue: string;
  children?: TreeViewNode[];
}

interface TreeViewProps {
  ariaLabel: string;
  items: TreeViewNode[];
  onAction?: (key: string) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
}

const TreeView = ({
  ariaLabel,
  items,
  onAction,
  selectionMode = 'none',
  defaultExpandedKeys
}: TreeViewProps) => {
  // When onAction is provided, react-aria-components doesn't toggle selected state automatically.
  // See: https://react-aria.adobe.com/Tree#selection-and-actions
  // We manage selectedKeys ourselves so selection state stays in React (not the DOM).
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const handleAction = (key: Key) => {
    setSelectedKeys((prev) => {
      const prevSet = prev === 'all' ? new Set<Key>() : new Set(prev);
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

  return (
    <Tree
      aria-label={ariaLabel}
      selectionMode={selectionMode}
      defaultExpandedKeys={defaultExpandedKeys}
      {...(onAction
        ? {
            onAction: handleAction,
            selectedKeys,
            onSelectionChange: setSelectedKeys
          }
        : {})}
    >
      {items.map((item) => (
        <TreeViewItem key={item.id} {...item} />
      ))}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
