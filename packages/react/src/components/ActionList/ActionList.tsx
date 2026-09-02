import React, { forwardRef, useCallback, useState } from 'react';
import classnames from 'classnames';
import { type ListboxOption } from '../Listbox/ListboxContext';
import Listbox from '../Listbox';
import {
  type ActionListSelectionType,
  type onActionCallbackFunction,
  type onActionEvent,
  ActionListProvider
} from './ActionListContext';
import useMnemonics from '../../utils/useMnemonics';
import setRef from '../../utils/setRef';

interface ActionListProps extends Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'defaultValue' | 'onSelect'
> {
  children: React.ReactNode;

  /** Limits the amount of selections that can be made within an action list */
  selectionType?: ActionListSelectionType | null;

  /** A callback function that is called when an action list item is selected. */
  onAction?: onActionCallbackFunction;
}

const ActionList = forwardRef<HTMLUListElement, ActionListProps>(
  ({ selectionType = null, onAction, className, children, ...props }, ref) => {
    // Listbox owns the active option. ActionList must not mirror it back down
    // as a controlled prop: the two copies then race, and a downward sync
    // carrying an already-stale value can revert a newer one and oscillate.
    // `activeOption` below is only a one-shot mnemonic request, never a
    // mirror. See cauldron#2512.
    const [activeOption, setActiveOption] = useState<ListboxOption>();

    const handleAction = useCallback(
      (key: string, event: onActionEvent) => {
        if (typeof onAction === 'function') {
          onAction(key, event);
        }
      },
      [onAction]
    );

    // A new object every match, even for the same element: this is a one-shot
    // request to Listbox rather than a mirror of its state, so re-using the
    // previous object would leave the controlled prop unchanged and the
    // request would never reach Listbox.
    const handleMnemonicMatch = useCallback((element: HTMLElement) => {
      setActiveOption({ element });
    }, []);

    const containerRef = useMnemonics<HTMLUListElement>({
      onMatch: handleMnemonicMatch,
      matchingElementsSelector:
        props.role === 'menu'
          ? '[role=menuitem],[role=menuitemcheckbox],[role=menuitemradio]'
          : '[role=option]'
    });

    return (
      <Listbox
        ref={(element: HTMLUListElement) => {
          if (ref) {
            setRef(ref, element);
          }
          containerRef.current = element;
        }}
        /* Listbox comes with an explicit role of "listbox", but we want to either
         * use the role from props, or default to the intrinsic role */
        // eslint-disable-next-line jsx-a11y/aria-role
        role={undefined}
        // Listbox internally sets aria-multiselectable from its multiselect prop.
        // ActionList manages roles independently, so override to undefined to
        // prevent the attribute from being rendered.
        aria-multiselectable={undefined}
        className={classnames('ActionList', className)}
        activeOption={activeOption}
        {...props}
        navigation="bound"
      >
        <ActionListProvider
          role={
            (props.role as React.ComponentProps<
              typeof ActionListProvider
            >['role']) || 'list'
          }
          onAction={handleAction}
          selectionType={selectionType}
        >
          {children}
        </ActionListProvider>
      </Listbox>
    );
  }
);

ActionList.displayName = 'ActionList';

export default ActionList;
