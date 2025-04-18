import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import { ListboxOption } from '../Listbox';
import { useActionListContext, type onActionEvent } from './ActionListContext';
import Icon from '../Icon';

interface ActionListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /**
   * A unique key to identify the action when triggered, when not provided
   * will use the child text content as the key.
   */
  key?: string;

  /** Provides an additional description for the list item. */
  description?: React.ReactNode;

  /** Indicates if the current action list item is selected. */
  selected?: boolean;

  /** When an action list item is disabled, it cannot be selected or activated. */
  disabled?: boolean;

  /** A callback function that is called when an action list item is selected. */
  onAction?: (event: onActionEvent) => void;
}

const ActionListItem = forwardRef<HTMLLIElement, ActionListItemProps>(
  (
    { key, className, description, selected, onAction, children, ...props },
    ref
  ) => {
    const [id] = useId(1, 'action-list-item');
    const labelRef = useRef<HTMLSpanElement>(null);
    const {
      role: contextRole,
      onAction: onActionListAction,
      selectionType
    } = useActionListContext();

    const handleAction = useCallback(
      (event: onActionEvent) => {
        if (event.defaultPrevented) {
          return;
        }

        if (selectionType === 'multiple') {
          // If action list is part of an action menu, prevent the menu from closing
          event.preventDefault();
        }

        if (typeof onAction === 'function') {
          onAction(event);
        }

        if (typeof onActionListAction === 'function') {
          onActionListAction(
            key || labelRef?.current?.innerText.trim() || '',
            event
          );
        }
      },
      [onAction, onActionListAction]
    );

    const role = useMemo(() => {
      if (contextRole === 'menu') {
        switch (selectionType) {
          case 'single':
            return 'menuitemradio';
          case 'multiple':
            return 'menuitemcheckbox';
          default:
            return 'menuitem';
        }
      }

      // if no other appropriate role, just default to using the intrinsic role of "listitem"
      return undefined;
    }, [contextRole]);

    const allowsSelection = !!selectionType;
    const isSelected = allowsSelection ? (selected ? true : false) : undefined;

    return (
      <ListboxOption
        ref={ref}
        key={key}
        id={id}
        role={role}
        className={classnames('ActionListItem', className)}
        activeClass="ActionListItem--active"
        aria-selected={undefined}
        aria-checked={isSelected}
        onClick={handleAction}
        {...props}
      >
        {allowsSelection && (
          <span className="ActionListItem__selection">
            <Icon type="check" />
          </span>
        )}
        <span className="ActionListItem__label" ref={labelRef}>
          {children}
        </span>
        {description && (
          <span className="ActionListItem__description">{description}</span>
        )}
      </ListboxOption>
    );
  }
);

ActionListItem.displayName = 'ActionListItem';

export default ActionListItem;
