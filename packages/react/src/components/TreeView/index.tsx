import React, { useEffect, useState } from 'react';
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

const TreeView = ({ items, ...rest }: TreeViewProps) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const handleChange = (id: string, checked: boolean) => {
    setCheckedIds((prev) => ({ ...prev, [id]: checked }));
  };

  useEffect(() => {
    console.log('checkedIds', checkedIds);
  }, [checkedIds]);

  return (
    <Tree {...rest}>
      {items.map((item) => (
        <TreeViewItem
          key={item.id}
          handleChange={handleChange}
          checkedIds={checkedIds}
          {...item}
        />
      ))}
    </Tree>
  );
};

TreeView.displayName = 'TreeView';

export default TreeView;
