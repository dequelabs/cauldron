import React, {
  type MutableRefObject,
  forwardRef,
  useCallback,
  useRef,
  useState
} from 'react';
import classnames from 'classnames';
import { type ListboxOption } from '../Listbox/ListboxContext';
import Listbox from '../Listbox';
import {
  type ActionListSelectionType,
  type onActionCallbackFunction,
  type onActionEvent,
  ActionListProvider
} from './ActionListContext';
import { useActionListContext } from './ActionListContext';
import useMnemonics from '../../utils/useMnemonics';
import setRef from '../../utils/setRef';

interface ActionListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;

  /** Limits the amount of selections that can be made within an action list */
  selectionType?: ActionListSelectionType | null;

  /** A callback function that is called when an action list item is selected. */
  onAction?: onActionCallbackFunction;
}

const ActionList = forwardRef<HTMLUListElement, ActionListProps>(
  ({ selectionType = null, onAction, className, children, ...props }, ref) => {
    const actionListContext = useActionListContext();
    const activeElement = useRef<
      HTMLLIElement | HTMLAnchorElement
    >() as MutableRefObject<HTMLLIElement | HTMLAnchorElement>;
    const [activeOption, setActiveOption] = useState<ListboxOption>();

    const handleActiveChange = useCallback((value: ListboxOption) => {
      activeElement.current = value?.element as
        | HTMLLIElement
        | HTMLAnchorElement;
      setActiveOption(value);
    }, []);

    const handleAction = useCallback(
      (key: string, event: onActionEvent) => {
        if (typeof onAction === 'function') {
          onAction(key, event);
        }
      },
      [onAction]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLUListElement | HTMLAnchorElement>) => {
        if (event.defaultPrevented) {
          return;
        }

        // Since focus is managed in the action list using `aria-activedescendant`
        // we want to simulate a keypress on the current active list item
        if (event.key === 'Enter' || event.key === ' ') {
          activeElement.current?.click();
        }
      },
      []
    );

    const containerRef = useMnemonics<HTMLUListElement>({
      onMatch: (element) => {
        setActiveOption({
          element
        });
      },
      matchingElementsSelector:
        props.role === 'menu'
          ? '[role=menuitem],[role=menuitemcheckbox],[role=menuitemradio]'
          : '[role=option]'
    }) as MutableRefObject<HTMLUListElement>;

    return (
      // Note: we should be able to use listbox without passing a prop
      // value for "multiselect"
      // see: https://github.com/dequelabs/cauldron/issues/1890
      // @ts-expect-error this should be allowed
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
        // aria-multiselectable is valid for listbox roles, but not list or menu roles
        // and we need to prevent aria-multiselectable from being set on Listbox when
        // we're not in a listbox context
        aria-multiselectable={
          actionListContext.role === 'listbox' ? undefined : null
        }
        className={classnames('ActionList', className)}
        activeOption={activeOption}
        {...props}
        onActiveChange={handleActiveChange}
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
