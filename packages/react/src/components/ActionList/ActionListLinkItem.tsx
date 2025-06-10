import React, { forwardRef, useMemo } from 'react';
import classnames from 'classnames';
import ActionListItem from './ActionListItem';
import { useActionListContext } from './ActionListContext';

type ActionListLinkItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<
    React.ComponentProps<typeof ActionListItem>,
    keyof React.HTMLAttributes<HTMLLIElement> | 'selected'
  > & { href: string };

const ActionListLinkItem = forwardRef<
  HTMLAnchorElement,
  ActionListLinkItemProps
>(
  (
    {
      key,
      className,
      // ActionListLinkItem should not be able to be "selected"
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selected,
      ...props
    },
    ref
  ) => {
    const { role: contextRole } = useActionListContext();
    const listItemRole = useMemo(() => {
      if (contextRole === 'menu') {
        return 'menuitem';
      }

      // istanbul ignore next
      if (contextRole && process.env.NODE_ENV !== 'production') {
        console.warn(
          'Use of ActionListLinkItem outside of a menu is unsupported and may result in unintentional accessibility issues.'
        );
      }

      return undefined;
    }, [contextRole]);

    return (
      <ActionListItem
        key={key}
        ref={ref}
        className={classnames('Link ActionListLinkItem', className)}
        as="a"
        role={listItemRole}
        tabIndex={listItemRole === 'menuitem' ? -1 : undefined}
        {...props}
      />
    );
  }
);

ActionListLinkItem.displayName = 'ActionListLinkItem';

export default ActionListLinkItem;
