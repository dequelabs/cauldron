import { Collection, TreeItem } from 'react-aria-components';
import TreeViewItemContent from './TreeViewItemContent';
import React from 'react';
import { TreeViewFileType } from '.';

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
    <TreeViewItemContent
      id={id}
      textValue={textValue}
      checkedIds={checkedIds}
      handleChange={(checked) => handleChange(id, checked)}
    />
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
