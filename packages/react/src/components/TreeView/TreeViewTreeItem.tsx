import React from 'react';
import { TreeItem, TreeItemProps } from 'react-aria-components';
import TreeViewTreeItemContent from './TreeViewTreeItemContent';

interface TreeViewTreeItemProps extends Partial<TreeItemProps> {
  title: string;
}

function TreeViewTreeItem({
  title,
  children,
  ...props
}: TreeViewTreeItemProps) {
  return (
    <TreeItem textValue={title} {...props}>
      <TreeViewTreeItemContent>{title}</TreeViewTreeItemContent>
      {children}
    </TreeItem>
  );
}

export default TreeViewTreeItem;
