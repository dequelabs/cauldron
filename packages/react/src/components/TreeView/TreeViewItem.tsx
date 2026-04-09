import React from 'react';
import {
  Button,
  Collection,
  TreeItem,
  TreeItemContent,
  TreeItemContentRenderProps
} from 'react-aria-components';
import { TreeViewNode } from '.';
import Icon from '../Icon';
import Checkbox from '../Checkbox';

const TreeViewItem = ({ id, textValue, children }: TreeViewNode) => {
  return (
    <TreeItem id={id} textValue={textValue}>
      <TreeItemContent>
        {({ selectionMode, isSelected }: TreeItemContentRenderProps) => (
          <>
            <Button slot="chevron">
              <Icon type="chevron-right" />
            </Button>
            {selectionMode !== 'none' ? (
              <Checkbox
                id={id}
                label={textValue}
                checked={isSelected}
                onChangeToggle={false}
                tabIndex={-1}
              />
            ) : (
              <>{textValue}</>
            )}
          </>
        )}
      </TreeItemContent>
      {children && children.length > 0 && (
        <Collection>
          {children.map((child) => (
            <TreeViewItem key={child.id} {...child} />
          ))}
        </Collection>
      )}
    </TreeItem>
  );
};

TreeViewItem.displayName = 'TreeViewItem';

export default TreeViewItem;
