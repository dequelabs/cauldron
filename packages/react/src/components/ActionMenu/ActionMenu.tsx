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
import type {
  onActionEvent,
  onActionCallbackFunction
} from '../ActionList/ActionListContext';
import type Listbox from '../Listbox';
import AnchoredOverlay from '../AnchoredOverlay';
import ClickOutsideListener from '../ClickOutsideListener';

const [ArrowDown, ArrowUp] = ['ArrowDown', 'ArrowUp'];

interface ActionMenuListProps {
  ref?: React.Ref<HTMLElement>;
  onAction?: onActionCallbackFunction;
  [key: string]: unknown;
}

/**
 * Props passed to an `ActionMenu` trigger render function. The element type
 * defaults to `HTMLButtonElement`; annotate it (e.g. `ActionMenuTriggerProps<HTMLLIElement>`)
 * when the trigger is not a button — for example a `MenuItem`/`TopBarItem`
 * (`<li>`) in the documented `TopBar`/`MenuBar` nesting — so the `ref` and
 * spread handlers type against the actual element without casts.
 */
export type ActionMenuTriggerProps<E extends HTMLElement = HTMLButtonElement> =
  Pick<
    React.HTMLAttributes<E>,
    | 'children'
    | 'id'
    | 'onClick'
    | 'onKeyDown'
    | 'aria-labelledby'
    | 'aria-expanded'
    | 'aria-haspopup'
    | 'aria-controls'
  > & {
    /**
     * Id for the element wrapping the trigger's visible label, e.g.
     * `<span id={labelId}>Menu</span>`. Only provided with `renderInTrigger`,
     * where the trigger contains the menu and would otherwise be named after
     * every item in it. Not a DOM attribute — destructure it out of the props.
     */
    labelId?: string;
    ref: React.RefObject<E | null>;
  };

export type ActionMenuTriggerFunction<
  E extends HTMLElement = HTMLButtonElement
> = (props: ActionMenuTriggerProps<E>, open: boolean) => React.ReactElement;

type ActionMenuProps<E extends HTMLElement = HTMLButtonElement> = {
  children: React.ReactElement<ActionMenuListProps>;
  trigger: React.ReactElement | ActionMenuTriggerFunction<E>;
  /** Render the action menu in a different location in the dom. */
  portal?: React.RefObject<HTMLElement | null> | HTMLElement;
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

const ActionMenuComponent = forwardRef<HTMLElement, ActionMenuProps>(
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
    const { ref: actionListRef, onAction: actionListOnAction } =
      actionMenuList.props;
    const actionMenuListRef = useSharedRef<HTMLElement>(actionListRef ?? null);
    const [labelId] = useId(1, 'menu-label');
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

    const handleOverlayBlur = useCallback((event: React.FocusEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement | null;

      if (
        !actionMenuRef.current?.contains(relatedTarget) &&
        !triggerRef.current?.contains(relatedTarget)
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

        if (typeof actionListOnAction === 'function') {
          actionListOnAction(key, event);
        }
      },
      [actionListOnAction]
    );

    useEffect(() => {
      if (open) {
        // Use double requestAnimationFrame to ensure layout is complete.
        // The first RAF schedules work for the next frame, the second ensures
        // the browser has actually completed the layout pass.
        // This prevents scroll jumping when opening ActionMenus.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            actionMenuListRef.current?.focus();
          });
        });
      } else if (actionMenuListRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
    }, [open]);

    // Triggers predating `labelId` render no label element. Since
    // `aria-labelledby` is not chained, naming the menu with such a trigger
    // would resolve back to the menu's own items, so it is left unnamed.
    const [hasLabelElement, setHasLabelElement] = useState(false);

    useEffect(() => {
      setHasLabelElement(
        renderInTrigger ? !!document.getElementById(labelId) : false
      );
    }, [renderInTrigger, labelId]);

    useEffect(() => {
      // istanbul ignore next
      if (
        renderInTrigger &&
        !document.getElementById(labelId) &&
        process.env.NODE_ENV !== 'production'
      ) {
        console.warn(
          `renderInTrigger should render id="${labelId}" on the element wrapping the trigger's visible label, otherwise the trigger and the menu are named after the entire submenu.`
        );
      }
    }, [renderInTrigger, labelId]);

    let labelledBy: string | undefined = triggerId;
    if (renderInTrigger) {
      labelledBy = hasLabelElement ? labelId : undefined;
    }
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
          // aria-labelledby is not chained, so pointing at a trigger that
          // contains this menu would resolve to the menu's own items.
          'aria-labelledby': labelledBy,
          focusStrategy,
          focusDisabledOptions: true,
          hidden
        })}
      </AnchoredOverlay>
    );

    // Spread onto a prerendered trigger element below, so this must stay
    // DOM-safe: no labelId.
    const baseTriggerProps: ActionMenuTriggerProps = useMemo(() => {
      return {
        ref: triggerRef,
        id: triggerId,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'aria-controls': menuId
      };
    }, [handleTriggerClick, handleTriggerKeyDown, open, triggerId, menuId]);

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
    }

    // Derived rather than mutated onto the memoized object, so that toggling
    // `renderInTrigger` off cannot leave a stale `children` behind.
    const triggerProps: ActionMenuTriggerProps = renderInTrigger
      ? {
          ...baseTriggerProps,
          children: overlay,
          'aria-labelledby': labelledBy
        }
      : baseTriggerProps;

    const actionMenuTrigger = React.isValidElement(trigger)
      ? React.cloneElement(trigger, triggerProps)
      : (trigger as ActionMenuTriggerFunction)(
          {
            ...triggerProps,
            children: overlay,
            ...(renderInTrigger && { labelId })
          },
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

ActionMenuComponent.displayName = 'ActionMenu';

/**
 * The trigger element type is parameterized (defaulting to `HTMLButtonElement`)
 * so it can be widened for nested menu patterns where the trigger is not a
 * button — e.g. a `MenuItem`/`TopBarItem` (`<li>`) inside a `TopBar`/`MenuBar`.
 * This only widens the public types of the `trigger` function; the internal
 * implementation is unaffected. See the ActionMenu docs for a usage example.
 */
type ActionMenuType = Omit<
  React.ForwardRefExoticComponent<ActionMenuProps>,
  keyof CallableFunction
> & {
  <E extends HTMLElement = HTMLButtonElement>(
    props: ActionMenuProps<E> & React.RefAttributes<HTMLElement>
  ): React.ReactElement;
};

const ActionMenu = ActionMenuComponent as ActionMenuType;

export default ActionMenu;
