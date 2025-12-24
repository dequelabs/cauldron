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
  checkedIds?: Record<string, boolean>;
  handleChange?: (checked: boolean) => void;
  id: string;
  textValue?: string;
}

function TreeViewItemContent({
  children,
  checkedIds,
  handleChange,
  id,
  textValue,
  ...rest
}: TreeViewItemContentProps) {
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
              checked={checkedIds?.[id] === true}
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
