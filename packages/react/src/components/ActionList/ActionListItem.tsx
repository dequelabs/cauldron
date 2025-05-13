import React, { forwardRef, useCallback, useRef, useLayoutEffect } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import { ListboxOption } from '../Listbox';
import Icon, { type IconType } from '../Icon';
import useSharedRef from '../../utils/useSharedRef';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';
import useIntersectionRef from '../../utils/useIntersectionRef';
import { useListboxContext } from '../Listbox';
import { useActionListContext, type onActionEvent } from './ActionListContext';

interface ActionListItemProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLLIElement>> {
  /**
   * A unique key to identify the action when triggered, when not provided
   * will use the child text content as the key.
   */
  actionKey?: string;

  /** Displays a leading icon for the action item. */
  leadingIcon?: IconType;

  /** Displays a trailing icon for the action item. */
  trailingIcon?: IconType;

  /** Provides an additional description for the action item. */
  description?: React.ReactNode;

  /** Indicates if the current action item is selected. */
  selected?: boolean;

  /** When an action item is disabled, it cannot be selected or activated. */
  disabled?: boolean;

  /** A callback function that is called when an action item is selected. */
  onAction?: (event: onActionEvent) => void;
}

const ActionListItem = forwardRef<HTMLLIElement, ActionListItemProps>(
  (
    {
      as: Component = 'li',
      actionKey,
      className,
      description,
      selected,
      leadingIcon,
      trailingIcon,
      onAction,
      children,
      ...props
    },
    ref
  ) => {
    const [id] = useId(1, 'action-list-item');
    const actionListItemRef = useSharedRef(ref);
    const labelRef = useRef<HTMLDivElement>(null);
    const { active } = useListboxContext();
    const {
      role: contextRole,
      onAction: onActionListAction,
      selectionType
    } = useActionListContext();
    const intersectionRef = useIntersectionRef<HTMLElement>(actionListItemRef, {
      root: null,
      threshold: 1.0
    });
    const isActive =
      !!active?.element && active.element === actionListItemRef.current;

    const handleAction = useCallback(
      (event: onActionEvent) => {
        if (event.defaultPrevented) {
          return;
        }

        if (selectionType === 'multiple') {
          // If action list is part of a multiselect menu, prevent the menu from closing
          event.preventDefault();
        }

        if (typeof onAction === 'function') {
          onAction(event);
        }

        // istanbul ignore else
        if (typeof onActionListAction === 'function') {
          onActionListAction(
            actionKey || labelRef?.current?.innerText.trim() || '',
            event
          );
        }
      },
      [onAction, onActionListAction, selectionType, actionKey]
    );

    let listItemRole: React.AriaRole | undefined = undefined;
    if (contextRole === 'menu') {
      switch (selectionType) {
        case 'single':
          listItemRole = 'menuitemradio';
          break;
        case 'multiple':
          listItemRole = 'menuitemcheckbox';
          break;
        default:
          listItemRole = 'menuitem';
          break;
      }
    } else if (contextRole === 'listbox') {
      listItemRole = 'option';
    }

    // Keep the currently active item on screen when navigate via up/down arrow key navigation
    // istanbul ignore next
    useLayoutEffect(() => {
      const intersectionEntry = intersectionRef.current;
      if (!intersectionEntry || !isActive) {
        return;
      }

      const rect = actionListItemRef.current.getBoundingClientRect();
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;

      if (!isInViewport || !intersectionEntry.isIntersecting) {
        actionListItemRef.current.scrollIntoView({
          inline: 'nearest',
          block: rect.top <= 0 ? 'end' : 'nearest'
        });
      }
    }, [isActive]);

    const allowsSelection = !!selectionType;
    const isSelected = allowsSelection ? !!selected : undefined;

    return (
      <ListboxOption
        as={Component}
        ref={actionListItemRef}
        id={id}
        role={listItemRole}
        className={classnames('ActionListItem', className)}
        activeClass="ActionListItem--active"
        aria-selected={undefined}
        aria-checked={listItemRole !== 'option' ? isSelected : undefined}
        onClick={handleAction}
        {...props}
      >
        {allowsSelection && (
          <span className="ActionListItem__selection">
            <Icon type="check" />
          </span>
        )}
        {leadingIcon && (
          <span className="ActionListItem__leadingIcon">
            <Icon type={leadingIcon} />
          </span>
        )}
        <div className="ActionListItem__label" ref={labelRef}>
          {children}
        </div>
        {description && (
          <div className="ActionListItem__description">{description}</div>
        )}
        {trailingIcon && (
          <span className="ActionListItem__trailingIcon">
            <Icon type={trailingIcon} />
          </span>
        )}
      </ListboxOption>
    );
  }
) as PolymorphicComponent<ActionListItemProps>;

ActionListItem.displayName = 'ActionListItem';

export default ActionListItem;
