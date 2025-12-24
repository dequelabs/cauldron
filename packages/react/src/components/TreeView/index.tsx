import React, { useState } from 'react';
import { Tree } from 'react-aria-components';
import TreeViewItem from './TreeViewItem';

export interface TreeViewFileType {
  id: string;
  textValue: string;
  type?: 'directory' | 'file';
  children?: TreeViewFileType[];
}

interface TreeViewProps {
  items: TreeViewFileType[];
  onAction?: () => void;
  selectionBehavior?: 'replace' | 'toggle';
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
}

const TreeView = ({ items, ...props }: TreeViewProps) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const handleChange = (id: string, checked: boolean) => {
    setCheckedIds((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <Tree {...props}>
      {items.map((item) => (
        <TreeViewItem
          handleChange={handleChange}
          checked={!!checkedIds[item.id]}
          key={item.id}
          {...item}
        />
      ))}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
