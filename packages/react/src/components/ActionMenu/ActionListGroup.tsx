import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import {
  type ActionListSelectionType,
  ActionListProvider,
  useActionListContext
} from './ActionListContext';
import { ListboxGroup } from '../Listbox';
import { ContentNode } from '../../types';

interface ActionListGroupProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Provides a label for the group of action items */
  label: ContentNode;

  /** Limits the amount of selections that can be made within an action group */
  selectionType: ActionListSelectionType;
}

const ActionListGroup = forwardRef<HTMLLIElement, ActionListGroupProps>(
  ({ id: propId, label, className, children, selectionType, ...props }) => {
    const [id] = propId ? [propId] : useId(1, 'actionlist-group-label');
    const actionListContext = useActionListContext();
    return (
      <li role="none">
        <ListboxGroup
          id={id}
          className={classnames('ActionListGroup', className)}
          label={label}
          {...props}
          as="ul"
        >
          <ActionListProvider
            {...actionListContext}
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
