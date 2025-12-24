import { Collection, TreeItem } from 'react-aria-components';
import TreeViewItemContent from './TreeViewItemContent';
import React from 'react';
import { TreeViewFileType } from '.';

interface TreeViewItemProps extends TreeViewFileType {
  checked?: boolean;
  handleChange: (id: string, checked: boolean) => void;
  onAction?: () => void;
}

const TreeViewItem = ({
  id,
  textValue,
  children,
  checked,
  handleChange,
  onAction
}: TreeViewItemProps) => (
  <TreeItem key={id} id={id} textValue={textValue} onAction={onAction}>
    <TreeViewItemContent
      id={id}
      textValue={textValue}
      checked={checked}
      handleChange={(checked) => handleChange(id, checked)}
    />
    {children && children.length > 0 && (
      <Collection items={children}>
        {children.map((child) => (
          <TreeViewItem
            key={child.id}
            handleChange={handleChange}
            onAction={onAction}
            checked={checked}
            {...child}
          />
        ))}
      </Collection>
    )}
  </TreeItem>
);

export default TreeViewItem;
