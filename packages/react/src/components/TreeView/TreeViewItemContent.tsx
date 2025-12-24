import React from 'react';
import Icon from '../Icon';
import {
  Button,
  TreeItemContent,
  TreeItemContentProps,
  TreeItemContentRenderProps
} from 'react-aria-components';
import Checkbox from '../Checkbox';

export interface TreeViewItemContentProps
  extends Omit<TreeItemContentProps, 'children'> {
  children?: React.ReactNode;
  checked?: boolean;
  handleChange?: (checked: boolean) => void;
  id: string;
  textValue?: string;
}

function TreeViewItemContent({
  children,
  checked,
  handleChange,
  id,
  textValue,
  ...rest
}: TreeViewItemContentProps) {
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

export default TreeViewItemContent;
