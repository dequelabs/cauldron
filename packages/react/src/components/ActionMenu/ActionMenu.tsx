import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect
} from 'react';
import AnchoredOverlay from '../AnchoredOverlay';
import ClickOutsideListener from '../ClickOutsideListener';
import { ActionListProvider } from './ActionListContext';
import { useId } from 'react-id-generator';

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
  closeOnAction?: boolean;
}

function ActionMenu({
  trigger,
  placement = 'bottom-start',
  closeOnAction,
  children: actionMenuList
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const actionMenuRef = useRef<HTMLElement>(null);
  const actionMenuListRef = useRef<HTMLElement>(null);
  const triggerId = useId(1, 'menu-trigger');

  const handleTriggerClick = useCallback(
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (!event.defaultPrevented) {
        setOpen(!open);
      }
    },
    [open]
  );

  const handleTriggerKeypress = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!event.defaultPrevented && event.key === 'ArrowDown') {
        setOpen(true);
      }
    },
    [open]
  );

  const triggerProps: React.HTMLAttributes<HTMLButtonElement> = useMemo(() => {
    return {
      ref: triggerRef,
      id: triggerId,
      onClick: handleTriggerClick,
      onKeyPress: handleTriggerKeypress,
      'aria-expanded': open ? true : undefined
    };
  }, [handleTriggerClick, handleTriggerKeypress, open]);

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

  const handleAction = useCallback(() => {
    if (closeOnAction) {
      setOpen(false);
    }
  }, [closeOnAction]);

  useEffect(() => {
    if (open) {
      actionMenuListRef.current?.focus();
    } else if (actionMenuListRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <ClickOutsideListener onClickOutside={handleClickOutside}>
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
        <ActionListProvider
          role="menu"
          selectionType={null}
          onAction={handleAction}
        >
          {React.cloneElement(actionMenuList, {
            ref: actionMenuListRef,
            role: 'menu',
            'aria-labelledby': triggerId
          })}
        </ActionListProvider>
      </AnchoredOverlay>
    </>
  );
}

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;
