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
  | 'children'
  | 'onClick'
  | 'onKeyDown'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-controls'
> & {
  ref: React.RefObject<HTMLButtonElement>;
};

type ActionMenuTriggerFunction = (
  props: ActionMenuTriggerProps,
  open: boolean
) => React.ReactElement;

type ActionMenuProps = {
  children: React.ReactElement;
  trigger: React.ReactElement | ActionMenuTriggerFunction;
  /** Render the action menu in a different location in the dom. */
  portal?: React.RefObject<HTMLElement> | HTMLElement;
  /**
   * Controls whether the menu should render as a child of the trigger, as opposed to
   * rendering as a sibling. Intended for use with nested menu patterns, for example
   * when an `ActionMenu` is nested inside a `TopBar`/`MenuBar`.
   *
   * Only supported if trigger is a function *and* portal is undefined.
   */
  renderInTrigger?: boolean;
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
      portal,
      renderInTrigger = false,
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
    const [menuId] = useId(1, 'menu');

    const handleTriggerClick = useCallback(
      (
        event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
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
      (event: React.KeyboardEvent<HTMLElement>) => {
        // istanbul ignore else
        if ([ArrowDown, ArrowUp].includes(event.key)) {
          // prevent page from scrolling if the user triggers the action menu
          // via an "ArrowDown" key press
          event.preventDefault();
          // allow other functions that may consume the event after
          // default is prevented to perform as normal
          event.defaultPrevented = false;
          setFocusStrategy(event.key === ArrowUp ? 'last' : 'first');

          if (open) {
            actionMenuListRef.current?.focus();
          } else {
            setOpen(true);
          }
        }
      },
      [open]
    );

    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
      if (
        !actionMenuRef.current?.contains(event.target as HTMLElement) &&
        !triggerRef.current?.contains(event.target as HTMLElement)
      ) {
        setOpen(false);
      }
    }, []);

    const handleOverlayBlur = useCallback(() => {
      setOpen(false);
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
        // Try to focus immediately if the element is visible
        if (actionMenuListRef.current?.offsetWidth > 0) {
          actionMenuListRef.current?.focus();
        } else {
          // If not visible yet, wait up to 200ms for actionMenuListRef.current to be visible.
          // Without this sometimes the page will scroll to the top of the page when the menu is opened on first open.
          // This issue most commonly occurred when a list of action menus
          // was rendered using map.
          setTimeout(() => {
            if (actionMenuListRef.current?.offsetWidth > 0) {
              actionMenuListRef.current?.focus();
            }
          }, 200);
        }
      } else if (actionMenuListRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
    }, [open]);

    const hidden = renderInTrigger && !open;

    const overlay = (
      <AnchoredOverlay
        ref={actionMenuRef}
        role="presentation"
        className={classnames('ActionMenu', className)}
        open={open}
        onOpenChange={setOpen}
        target={triggerRef}
        placement={placement}
        offset={4}
        portal={portal}
        style={{ display: !open ? 'none' : undefined, ...style }}
        aria-hidden={hidden}
        onBlur={handleOverlayBlur}
        {...props}
      >
        {React.cloneElement(actionMenuList, {
          ref: actionMenuListRef,
          id: menuId,
          role: 'menu',
          onAction: handleAction,
          'aria-labelledby': triggerId,
          focusStrategy,
          focusDisabledOptions: true,
          hidden
        })}
      </AnchoredOverlay>
    );

    const triggerProps: ActionMenuTriggerProps = useMemo(() => {
      return {
        ref: triggerRef,
        id: triggerId,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'aria-controls': menuId
      };
    }, [handleTriggerClick, open, menuId]);

    if (renderInTrigger) {
      // istanbul ignore next
      if (portal && process.env.NODE_ENV !== 'production') {
        console.warn('renderInTrigger is incompatible with portal.');
      }
      // istanbul ignore next
      if (React.isValidElement(trigger)) {
        console.warn(
          'renderInTrigger requires the use of a trigger function, rather than a prerendered trigger ReactElement.'
        );
      }

      triggerProps.children = overlay;
    }

    const actionMenuTrigger = React.isValidElement(trigger)
      ? React.cloneElement(trigger, triggerProps)
      : (trigger as ActionMenuTriggerFunction)(
          { ...triggerProps, children: overlay },
          open
        );

    return (
      <>
        <ClickOutsideListener
          onClickOutside={handleClickOutside}
          mouseEvent={open ? undefined : false}
          touchEvent={open ? undefined : false}
          target={triggerProps.ref}
        >
          {actionMenuTrigger}
        </ClickOutsideListener>
        {renderInTrigger ? null : overlay}
      </>
    );
  }
);

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;
