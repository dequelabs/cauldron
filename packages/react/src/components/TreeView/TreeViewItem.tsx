import React, { useMemo } from 'react';
import {
  Button,
  Collection,
  TreeItem,
  TreeItemContent,
  TreeItemContentRenderProps
} from 'react-aria-components';
import nextId from 'react-id-generator';
import { TreeViewNode } from './types';
import Icon from '../Icon';
import Checkbox from '../Checkbox';

const TreeViewItem = ({ id, textValue, children }: TreeViewNode) => {
  const checkboxId = useMemo(() => nextId('tree-view-item-'), []);

  return (
    <TreeItem id={id} textValue={textValue} className="TreeView__item">
      <TreeItemContent>
        {({ selectionMode, isSelected }: TreeItemContentRenderProps) => (
          <>
            <Button slot="chevron" className="TreeView__chevron">
              <Icon type="chevron-right" />
            </Button>
            {selectionMode !== 'none' ? (
              <Checkbox
                id={checkboxId}
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
