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
  handleChange?: (checked: boolean) => void;
  id: string;
  textValue?: string;
}

function TreeViewTreeItemContent({
  children,
  checked,
  handleChange,
  id,
  textValue,
  ...rest
}: TreeViewTreeItemContentProps) {
  console.log('strudel', checked);
  return (
    <TreeItemContent {...rest}>
      {({ selectionBehavior, selectionMode }: TreeItemContentRenderProps) => (
        <>
          <Button slot="chevron">
            <Icon type="chevron-right" label="expand or collapse" />
          </Button>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' ? (
            <Checkbox
              id={id}
              label={textValue}
              checked={checked}
              onChange={(e) => handleChange?.(e.target.checked)}
            />
          ) : (
            <>{textValue}</>
          )}
          {children}
        </>
      )}
    </TreeItemContent>
  );
}

export default TreeViewTreeItemContent;
