import React, { forwardRef } from 'react';
import ActionListItem from './ActionListItem';
import Link from '../Link';

type ActionListLinkItemProps = React.HTMLAttributes<HTMLAnchorElement> &
  Omit<
    React.ComponentProps<typeof ActionListItem>,
    keyof React.HTMLAttributes<HTMLLIElement>
  >;

const ActionListLinkItem = forwardRef<
  HTMLAnchorElement,
  ActionListLinkItemProps
>(
  (
    {
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
    return (
      <ActionListItem
        className={className}
        description={description}
        selected={selected}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        onAction={onAction}
      >
        <Link className="ActionListItem__link" ref={ref} {...props}>
          {children}
        </Link>
      </ActionListItem>
    );
  }
);

ActionListLinkItem.displayName = 'ActionListLinkItem';

export default ActionListLinkItem;
