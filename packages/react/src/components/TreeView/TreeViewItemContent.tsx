import React from 'react';
import Icon from '../Icon';
import {
  Button,
  TreeItemContent,
  TreeItemContentProps,
  TreeItemContentRenderProps
} from 'react-aria-components';
import Checkbox from '../Checkbox';

export interface TreeViewItemContentProps extends TreeItemContentProps {
  id: string;
  textValue: string;
  checkedIds?: Record<string, boolean>;
  handleChange?: (checked: boolean) => void;
  children?: React.ReactNode;
}

function TreeViewItemContent({
  id,
  textValue,
  checkedIds,
  handleChange,
  children,
  ...rest
}: TreeViewItemContentProps) {
  return (
    <TreeItemContent {...rest}>
      {({ selectionBehavior, selectionMode }: TreeItemContentRenderProps) => (
        <>
          <Button slot="chevron">
            <Icon type="chevron-right" />
          </Button>
          {selectionBehavior === 'toggle' && selectionMode !== 'none' ? (
            <Checkbox
              id={id}
              label={textValue}
              checked={checkedIds?.[id]}
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

TreeViewItemContent.displayName = 'TreeViewItemContent';
export default TreeViewItemContent;
