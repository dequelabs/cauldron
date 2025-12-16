import React from 'react';
import { Tree } from 'react-aria-components';
import TreeViewTreeItem from './TreeViewTreeItem';

interface TreeViewProps {
  children: React.ReactNode;
}

export const TreeView = (props: TreeViewProps) => {
  return (
    <Tree
      aria-label="Files"
      selectionBehavior="toggle"
      selectionMode="multiple"
      defaultExpandedKeys={['documents', 'photos', 'project']}
    >
      <TreeViewTreeItem id="documents" title="Documents">
        <TreeViewTreeItem id="project" title="Project">
          <TreeViewTreeItem id="report" title="Weekly Report" />
        </TreeViewTreeItem>
      </TreeViewTreeItem>
      <TreeViewTreeItem id="photos" title="Photos">
        <TreeViewTreeItem id="one" title="Image 1" />
        <TreeViewTreeItem id="two" title="Image 2" />
      </TreeViewTreeItem>
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
