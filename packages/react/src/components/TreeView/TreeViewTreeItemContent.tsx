import React from 'react';
import Icon from '../Icon';
import {
  Button,
  TreeItemContent,
  TreeItemContentProps,
  TreeItemContentRenderProps
} from 'react-aria-components';
import Checkbox from '../Checkbox';

export interface TreeViewTreeItemContentProps
  extends Omit<TreeItemContentProps, 'children'> {
  children?: React.ReactNode;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  checkboxId?: string;
  checkboxLabel?: React.ReactNode;
}

function TreeViewTreeItemContent({
  children,
  checked,
  onCheckChange,
  checkboxId = '',
  checkboxLabel = undefined,
  ...rest
}: TreeViewTreeItemContentProps) {
  return (
    <TreeItemContent {...rest}>
      {({ selectionBehavior, selectionMode }: TreeItemContentRenderProps) => (
        <>
          <Button slot="chevron">
            <Icon type="chevron-right" label="expand or collapse" />
          </Button>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
            <Checkbox
              id={checkboxId}
              label={checkboxLabel}
              checked={checked}
              onChange={(e) => onCheckChange?.(e.target.checked)}
            />
          )}
          {children}
        </>
      )}
    </TreeItemContent>
  );
}

export default TreeViewTreeItemContent;
