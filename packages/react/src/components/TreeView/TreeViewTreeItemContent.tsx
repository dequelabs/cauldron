import React from 'react';
import Icon from '../Icon';
import {
  Button,
  TreeItemContent,
  TreeItemContentProps,
  TreeItemContentRenderProps
} from 'react-aria-components';
import Checkbox from '../Checkbox';

function TreeViewTreeItemContent({
  children
}: Omit<TreeItemContentProps, 'children'> & { children?: React.ReactNode }) {
  return (
    <TreeItemContent>
      {({ selectionBehavior, selectionMode }: TreeItemContentRenderProps) => (
        <>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox id={''} label={undefined} />
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
