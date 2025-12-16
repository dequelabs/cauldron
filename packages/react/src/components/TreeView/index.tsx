import React from 'react';
import { Collection, Tree, TreeItem } from 'react-aria-components';
import TreeViewTreeItemContent from './TreeViewTreeItemContent';

interface TreeViewProps {
  items: TreeViewFileType[];
  onAction?: () => void;
  selectionBehavior?: 'replace' | 'toggle';
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
}

interface TreeViewFileType {
  id: string;
  title: string;
  type?: 'directory' | 'file';
  children?: TreeViewFileType[];
}

export const TreeView = ({ onAction, ...props }: TreeViewProps) => {
  return (
    <Tree {...props}>
      {function renderItem({ title, children }: TreeViewFileType) {
        return (
          <TreeItem textValue={title} onAction={onAction}>
            <TreeViewTreeItemContent>{title}</TreeViewTreeItemContent>
            <Collection items={children}>{children && renderItem}</Collection>
          </TreeItem>
        );
      }}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
