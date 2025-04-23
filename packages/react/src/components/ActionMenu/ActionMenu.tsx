import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect
} from 'react';
import { useId } from 'react-id-generator';
import AnchoredOverlay from '../AnchoredOverlay';
import ClickOutsideListener from '../ClickOutsideListener';
import useSharedRef from '../../utils/useSharedRef';
import type { onActionEvent } from './ActionListContext';

const [ArrowDown] = ['ArrowDown'];

type ActionMenuTriggerProps = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  'onClick' | 'onKeyPress' | 'aria-expanded'
>;

type ActionMenuTriggerFunction = (
  props: ActionMenuTriggerProps,
  open: boolean
) => React.ReactElement;

interface ActionMenuProps
  extends Pick<React.ComponentProps<typeof AnchoredOverlay>, 'placement'> {
  children: React.ReactElement;
  trigger: React.ReactElement | ActionMenuTriggerFunction;
  open?: boolean;
}

function ActionMenu({
  trigger,
  placement = 'bottom-start',
  open: openProp,
  children: actionMenuList
}: ActionMenuProps) {
  const [open, setOpen] = useState(!!openProp);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const actionMenuRef = useRef<HTMLElement>(null);
  const actionMenuListRef = useSharedRef<HTMLElement>(actionMenuList.props.ref);
  const triggerId = useId(1, 'menu-trigger');
  const isControlled = typeof openProp === 'boolean';

  const handleTriggerClick = useCallback(
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (!event.defaultPrevented && !isControlled) {
        setOpen(!open);
      }
    },
    [open, isControlled]
  );

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === ArrowDown && !isControlled && !open) {
        // prevent page from scrolling if the user triggers the action menu
        // via an "ArrowDown" key press
        event.preventDefault();
      }
    },
    [open, isControlled]
  );

  // @ts-expect-error for now...
  const triggerProps: React.HTMLAttributes<HTMLButtonElement> = useMemo(() => {
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
      if (event.defaultPrevented) {
        return;
      }

      if (!isControlled) {
        setOpen(false);
      }

      const { onAction } = actionMenuList.props;
      if (typeof onAction === 'function') {
        onAction(key, event);
      }
    },
    [isControlled, actionMenuList.props.onAction]
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
        className="ActionMenu"
        open={open}
        onOpenChange={setOpen}
        target={triggerRef}
        placement={placement}
        offset={4}
        style={{ display: !open ? 'none' : undefined }}
      >
        {React.cloneElement(actionMenuList, {
          ref: actionMenuListRef,
          role: 'menu',
          onAction: handleAction,
          'aria-labelledby': triggerId
        })}
      </AnchoredOverlay>
    </>
  );
}

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;
