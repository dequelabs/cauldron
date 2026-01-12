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
  onAction?: () => void;
}

const TreeViewItem = ({
  id,
  textValue,
  children,
  onAction
}: TreeViewItemProps) => (
  <TreeItem key={id} id={id} textValue={textValue} onAction={onAction}>
    <TreeItemContent>
      {({ selectionMode, isSelected }: TreeItemContentRenderProps) => (
        <>
          <Button slot="chevron">
            <Icon type="chevron-right" />
          </Button>
          {selectionMode !== 'none' ? (
            <Checkbox id={id} label={textValue} checked={isSelected} />
          ) : (
            <>{textValue}</>
          )}
        </>
      )}
    </TreeItemContent>
    {children && children?.length > 0 && (
      <Collection items={children}>
        {children.map((child) => (
          <TreeViewItem key={child.id} {...child} />
        ))}
      </Collection>
    )}
  </TreeItem>
);

TreeViewItem.displayName = 'TreeViewItem';

export default TreeViewItem;
