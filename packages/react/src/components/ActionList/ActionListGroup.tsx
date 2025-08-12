import React, { forwardRef, useCallback } from 'react';
import { useId } from 'react-id-generator';
import {
  type ActionListSelectionType,
  type onActionCallbackFunction,
  type onActionEvent,
  ActionListProvider,
  useActionListContext
} from './ActionListContext';
import { ListboxGroup } from '../Listbox';
import { ContentNode } from '../../types';

interface ActionListGroupProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Provides a label for the group of action items */
  label: ContentNode;

  /** Limits the amount of selections that can be made within an action group */
  selectionType?: ActionListSelectionType | null;

  /** A callback function that is called when an action list item is selected. */
  onAction?: onActionCallbackFunction;
}

const ActionListGroup = forwardRef<HTMLLIElement, ActionListGroupProps>(
  ({ id: propId, label, children, selectionType, onAction, ...props }, ref) => {
    const [id] = propId ? [propId] : useId(1, 'actionlist-group-label');
    const actionListContext = useActionListContext();

    const handleAction = useCallback(
      (key: string, event: onActionEvent) => {
        // istanbul ignore else
        if (typeof onAction === 'function') {
          onAction(key, event);
        }

        // istanbul ignore else
        if (typeof actionListContext.onAction === 'function') {
          actionListContext.onAction(key, event);
        }
      },
      [onAction, actionListContext.onAction]
    );

    const listItemRole: React.AriaRole | undefined = [
      'menu',
      'listbox'
    ].includes(actionListContext.role as string)
      ? 'none'
      : undefined;

    const groupRole: React.AriaRole | undefined = ['menu', 'listbox'].includes(
      actionListContext.role as string
    )
      ? 'group'
      : 'list';

    return (
      <li ref={ref} role={listItemRole} {...props}>
        <ListboxGroup
          id={id}
          role={groupRole}
          className="ActionListGroup"
          label={label}
          as="ul"
        >
          <ActionListProvider
            {...actionListContext}
            onAction={handleAction}
            selectionType={selectionType || actionListContext.selectionType}
          >
            {children}
          </ActionListProvider>
        </ListboxGroup>
      </li>
    );
  }
);

ActionListGroup.displayName = 'ActionListGroup';

export default ActionListGroup;
