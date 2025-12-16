import React from 'react';
import Icon from '../Icon';
import classNames from 'classnames';
import {
  Button,
  Checkbox,
  Tree,
  TreeItem,
  TreeItemContent,
  TreeItemProps,
  TreeItemContentProps,
  TreeItemContentRenderProps
} from 'react-aria-components';

interface TreeViewProps {
  children: React.ReactNode;
}

interface MyTreeItemProps extends Partial<TreeItemProps> {
  title: string;
}

function MyTreeItemContent({
  children
}: Omit<TreeItemContentProps, 'children'> & { children?: React.ReactNode }) {
  return (
    <TreeItemContent>
      {({ selectionBehavior, selectionMode }: TreeItemContentRenderProps) => (
        <>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox slot="selection" />
          )}
          <Button slot="chevron">
            <Icon type="chevron-right" label="expand or collapse" />
          </Button>
          {children}
        </>
      )}
    </TreeItemContent>
  );
}

function MyTreeItem({ title, children, ...props }: MyTreeItemProps) {
  return (
    <TreeItem textValue={title} {...props}>
      <MyTreeItemContent>{title}</MyTreeItemContent>
      {children}
    </TreeItem>
  );
}

export const TreeView = (props: TreeViewProps) => {
  return (
    <Tree
      aria-label="Files"
      style={{ height: '300px' }}
      selectionBehavior="toggle"
      selectionMode="single"
      defaultExpandedKeys={['documents', 'photos', 'project']}
    >
      <MyTreeItem id="documents" title="Documents">
        <MyTreeItem id="project" title="Project">
          <MyTreeItem id="report" title="Weekly Report" />
        </MyTreeItem>
      </MyTreeItem>
      <MyTreeItem id="photos" title="Photos">
        <MyTreeItem id="one" title="Image 1" />
        <MyTreeItem id="two" title="Image 2" />
      </MyTreeItem>
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
