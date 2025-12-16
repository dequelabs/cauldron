import React from 'react';
import Icon from '../Icon';
import {
  Button,
  Checkbox,
  TreeItemContent,
  TreeItemContentProps,
  TreeItemContentRenderProps
} from 'react-aria-components';

function TreeViewTreeItemContent({
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

export default TreeViewTreeItemContent;
