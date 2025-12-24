import React, { useState, useCallback, useEffect } from 'react';
import { Collection, Tree, TreeItem } from 'react-aria-components';
import TreeViewTreeItemContent from './TreeViewTreeItemContent';

interface TreeViewProps {
  items: TreeViewFileType[];
  onAction?: () => void;
  selectionBehavior?: 'replace' | 'toggle';
  selectionMode?: 'none' | 'single' | 'multiple';
  defaultExpandedKeys?: string[];
}

interface TreeViewFileType {
  id: string;
  textValue: string;
  type?: 'directory' | 'file';
  children?: TreeViewFileType[];
}

const TreeView = ({ onAction, ...props }: TreeViewProps) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const handleCheckChange = (id: string, checked: boolean) => {
    setCheckedIds((prev) => ({ ...prev, [id]: checked }));
  };

  const renderItem = useCallback(
    ({ id, textValue, children }: TreeViewFileType) => {
      return (
        <TreeItem id={id} textValue={textValue} onAction={onAction}>
          <TreeViewTreeItemContent
            checkboxId={id}
            checkboxLabel={textValue}
            checked={!!checkedIds[id]}
            onCheckChange={(checked) => handleCheckChange(id, checked)}
          />
          <Collection items={children}>{children && renderItem}</Collection>
        </TreeItem>
      );
    },
    [checkedIds, handleCheckChange, onAction]
  );

  useEffect(() => {
    console.log(checkedIds);
  }, [checkedIds]);

  return <Tree {...props}>{renderItem}</Tree>;
};

TreeView.displayName = 'TreeView';

export default TreeView;
