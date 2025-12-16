import React from 'react';
import { Collection, Tree, TreeItem } from 'react-aria-components';
import TreeViewTreeItemContent from './TreeViewTreeItemContent';

interface TreeViewProps {
  selectionBehavior?: 'replace' | 'toggle';
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
  items: TreeViewFileType[];
}

interface TreeViewFileType {
  id: string;
  title: string;
  type: 'directory' | 'file';
  children?: TreeViewFileType[];
}

export const TreeView = (props: TreeViewProps) => {
  return (
    <Tree {...props}>
      {function renderItem({ title, children }: TreeViewFileType) {
        return (
          <TreeItem textValue={title}>
            <TreeViewTreeItemContent>{title}</TreeViewTreeItemContent>
            <Collection items={children}>
              {/* recursively render children */}
              {children && renderItem}
            </Collection>
          </TreeItem>
        );
      }}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
