import React from 'react';
import {
  Button,
  Collection,
  TreeItem,
  TreeItemContent,
  TreeItemContentRenderProps
} from 'react-aria-components';
import { TreeViewFileType } from '.';
import Icon from '../Icon';
import Checkbox from '../Checkbox';

interface TreeViewItemProps extends TreeViewFileType {
  checkedIds: Record<string, boolean>;
  handleChange: (id: string, checked: boolean) => void;
  onAction?: () => void;
}

const TreeViewItem = ({
  id,
  textValue,
  checkedIds,
  children,
  handleChange,
  onAction
}: TreeViewItemProps) => (
  <TreeItem key={id} id={id} textValue={textValue} onAction={onAction}>
    <TreeItemContent>
      {({ selectionMode }: TreeItemContentRenderProps) => (
        <>
          <Button slot="chevron">
            <Icon type="chevron-right" />
          </Button>
          {selectionMode !== 'none' ? (
            <Checkbox
              id={id}
              label={textValue}
              checked={checkedIds?.[id]}
              onChange={(e) => handleChange(id, e.target.checked)}
            />
          ) : (
            <>{textValue}</>
          )}
        </>
      )}
    </TreeItemContent>
    {children && children?.length > 0 && (
      <Collection items={children}>
        {children.map((child) => (
          <TreeViewItem
            key={child.id}
            handleChange={handleChange}
            checkedIds={checkedIds}
            {...child}
          />
        ))}
      </Collection>
    )}
  </TreeItem>
);

TreeViewItem.displayName = 'TreeViewItem';
export default TreeViewItem;
