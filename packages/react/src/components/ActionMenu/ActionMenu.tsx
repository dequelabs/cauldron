import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect
} from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import useSharedRef from '../../utils/useSharedRef';
import type { onActionEvent } from '../ActionList/ActionListContext';
import type Listbox from '../Listbox';
import AnchoredOverlay from '../AnchoredOverlay';
import ClickOutsideListener from '../ClickOutsideListener';

const [ArrowDown, ArrowUp] = ['ArrowDown', 'ArrowUp'];

type ActionMenuTriggerProps = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  'onClick' | 'onKeyUpCapture' | 'onKeyDown' | 'aria-expanded'
>;

type ActionMenuTriggerFunction = (
  props: ActionMenuTriggerProps,
  open: boolean
) => React.ReactElement;

type ActionMenuProps = {
  children: React.ReactElement;
  trigger: React.ReactElement | ActionMenuTriggerFunction;
} & Pick<React.ComponentProps<typeof AnchoredOverlay>, 'placement'> &
  React.HTMLAttributes<HTMLElement>;

const ActionMenu = forwardRef<HTMLElement, ActionMenuProps>(
  (
    {
      className,
      style,
      trigger,
      placement = 'bottom-start',
      children: actionMenuList,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [focusStrategy, setFocusStrategy] =
      useState<React.ComponentProps<typeof Listbox>['focusStrategy']>('first');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const actionMenuRef = useSharedRef<HTMLElement>(ref);
    const actionMenuListRef = useSharedRef<HTMLElement>(
      actionMenuList.props.ref
    );
    const [triggerId] = useId(1, 'menu-trigger');

    const handleTriggerClick = useCallback(
      (
        event:
          | React.MouseEvent<HTMLButtonElement>
          | React.KeyboardEvent<HTMLButtonElement>
      ) => {
        // istanbul ignore else
        if (!event.defaultPrevented) {
          setOpen(!open);
          setFocusStrategy('first');
        }
      },
      [open]
    );

    const handleTriggerKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // istanbul ignore else
        if ([ArrowDown, ArrowUp].includes(event.key) && !open) {
          // prevent page from scrolling if the user triggers the action menu
          // via an "ArrowDown" key press
          event.preventDefault();
          // allow other functions that may consume the event after
          // default is prevented to perform as normal
          event.defaultPrevented = false;
          setFocusStrategy(event.key === ArrowUp ? 'last' : 'first');
          setOpen(true);
        }
      },
      [open]
    );

    const triggerProps: React.HTMLAttributes<HTMLButtonElement> =
      useMemo(() => {
        return {
          ref: triggerRef,
          id: triggerId,
          onClick: handleTriggerClick,
          onKeyUpCapture: (event) => event.preventDefault,
          onKeyDown: handleTriggerKeyDown,
          'aria-expanded': open ? true : undefined
        };
      }, [handleTriggerClick, open]);

    const actionMenuTrigger = React.isValidElement(trigger)
      ? React.cloneElement(trigger, triggerProps)
      : (trigger as ActionMenuTriggerFunction)(triggerProps, open);

    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
      if (
        !actionMenuRef.current?.contains(event.target as HTMLElement) &&
        !triggerRef.current?.contains(event.target as HTMLElement)
      ) {
        setOpen(false);
      }
    }, []);

    const handleAction = useCallback(
      (key: string, event: onActionEvent) => {
        // istanbul ignore else
        if (!event.defaultPrevented) {
          setOpen(false);
        }

        const { onAction } = actionMenuList.props;
        if (typeof onAction === 'function') {
          onAction(key, event);
        }
      },
      [actionMenuList.props.onAction]
    );

    useEffect(() => {
      if (open) {
        actionMenuListRef.current?.focus();
      } else if (actionMenuListRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
    }, [open]);

    return (
      <>
        <ClickOutsideListener
          onClickOutside={handleClickOutside}
          mouseEvent={open ? undefined : false}
          touchEvent={open ? undefined : false}
        >
          {actionMenuTrigger}
        </ClickOutsideListener>
        <AnchoredOverlay
          ref={actionMenuRef}
          role="presentation"
          className={classnames('ActionMenu', className)}
          open={open}
          onOpenChange={setOpen}
          target={triggerRef}
          placement={placement}
          offset={4}
          style={{ display: !open ? 'none' : undefined, ...style }}
          {...props}
        >
          {React.cloneElement(actionMenuList, {
            ref: actionMenuListRef,
            role: 'menu',
            onAction: handleAction,
            'aria-labelledby': triggerId,
            focusStrategy
          })}
        </AnchoredOverlay>
      </>
    );
  }
);

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;
