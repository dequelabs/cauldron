import React from 'react';
import { Tree } from 'react-aria-components';
import TreeViewItem from './TreeViewItem';

export interface TreeViewFileType {
  id: string;
  textValue: string;
  children?: TreeViewFileType[];
}

interface TreeViewProps {
  ariaLabel: string;
  items: TreeViewFileType[];
  onAction?: () => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
}

const TreeView = ({
  ariaLabel,
  items,
  selectionMode,
  ...rest
}: TreeViewProps) => {
  return (
    <Tree aria-label={ariaLabel} selectionMode={selectionMode} {...rest}>
      {items.map((item) => (
        <TreeViewItem key={item.id} {...item} />
      ))}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
