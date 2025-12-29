import React, { useState } from 'react';
import { Tree } from 'react-aria-components';
import TreeViewItem from './TreeViewItem';

export interface TreeViewFileType {
  id: string;
  textValue: string;
  children?: TreeViewFileType[];
}

interface TreeViewProps {
  items: TreeViewFileType[];
  onAction?: () => void;
  selectionBehavior?: 'replace' | 'toggle';
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
}

const TreeView = ({ items, selectionMode, ...rest }: TreeViewProps) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const setMultipleChecked = (id: string, checked: boolean) => {
    setCheckedIds((prev) => ({ ...prev, [id]: checked }));
  };

  const setSingleChecked = (id: string, checked: boolean) => {
    setCheckedIds({ [id]: checked });
  };

  return (
    <Tree selectionMode={selectionMode} {...rest}>
      {items.map((item) => (
        <TreeViewItem
          key={item.id}
          handleChange={
            selectionMode === 'single' ? setSingleChecked : setMultipleChecked
          }
          checkedIds={checkedIds}
          {...item}
        />
      ))}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
