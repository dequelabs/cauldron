import React, { useRef, useState, useEffect } from 'react';
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
}: TreeViewItemProps) => {
  const treeItemRef = useRef(null);

  //by default, react-aria-components doesn't toggle the selected state if you provide a custom onAction handler.
  const handleOnAction = (key: string, onAction?: (key: string) => void) => {
    const elm = treeItemRef.current;
    if (elm) {
      const selected = (elm as HTMLDivElement).getAttribute('aria-selected');
      (elm as HTMLDivElement).setAttribute(
        'aria-selected',
        selected === 'true' ? 'false' : 'true'
      );
      if (onAction) {
        onAction(key);
      }
    }
  };

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const elm = treeItemRef.current;
    if (!elm) return;
    const observer = new MutationObserver(() => {
      const selected = (elm as HTMLDivElement).getAttribute('aria-selected');
      setChecked(selected === 'true');
    });
    observer.observe(elm, {
      attributes: true,
      attributeFilter: ['aria-selected']
    });
    return () => observer.disconnect();
  }, []);

  return (
    <TreeItem
      key={id}
      id={id}
      textValue={textValue}
      {...(onAction ? { onAction: () => handleOnAction(id, onAction) } : {})}
      ref={treeItemRef}
    >
      <TreeItemContent>
        {({ selectionMode }: TreeItemContentRenderProps) => (
          <>
            <Button slot="chevron">
              <Icon type="chevron-right" />
            </Button>
            {selectionMode !== 'none' ? (
              <Checkbox id={id} label={textValue} checked={checked} />
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
};

TreeViewItem.displayName = 'TreeViewItem';

export default TreeViewItem;
