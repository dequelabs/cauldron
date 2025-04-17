import React, { forwardRef, useMemo } from 'react';
import classnames from 'classnames';
import {
  type ActionListSelectionType,
  type onActionCallbackFunction,
  ActionListProvider,
  useActionListContext
} from './ActionListContext';
import Listbox from '../Listbox';

interface ActionListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  // children: Array<ActionListItem | ActionListLinkItem | ActionListGroup>

  /** Limits the amount of selections that can be made within an action list */
  selectionType?: ActionListSelectionType | null;

  /** A callback function that is called when an action list item is selected. */
  onAction?: onActionCallbackFunction;
}

const ActionList = forwardRef<HTMLUListElement, ActionListProps>(
  ({ selectionType = null, onAction, className, children, ...props }, ref) => {
    const context = useActionListContext();
    const handleAction = useMemo(() => {
      if (typeof onAction !== 'function') {
        return () => null;
      }

      return onAction;
    }, [onAction]);

    return (
      <Listbox
        ref={ref}
        /* Listbox comes with an explicit role of "listbox", but we want to either
         * use the role from props, or default to the intrinsic role */
        // eslint-disable-next-line jsx-a11y/aria-role
        role={undefined}
        aria-multiselectable={undefined}
        className={classnames('ActionList', className)}
        {...props}
        navigation="bound"
      >
        <ActionListProvider {...context} selectionType={selectionType}>
          {children}
        </ActionListProvider>
      </Listbox>
    );
  }
);

ActionList.displayName = 'ActionList';

export default ActionList;
