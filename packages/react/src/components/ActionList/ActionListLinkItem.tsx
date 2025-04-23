import React, { forwardRef, useMemo } from 'react';
import ActionListItem from './ActionListItem';
import { useActionListContext } from './ActionListContext';

type ActionListLinkItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<
    React.ComponentProps<typeof ActionListItem>,
    keyof React.HTMLAttributes<HTMLLIElement | 'selected'>
  >;

const ActionListLinkItem = forwardRef<
  HTMLAnchorElement,
  ActionListLinkItemProps
>(
  (
    {
      key,
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

      if (process.env.NODE_ENV !== 'production') {
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
        className="Link ActionListLinkItem"
        as="a"
        role={listItemRole}
        {...props}
      />
    );
  }
);

ActionListLinkItem.displayName = 'ActionListLinkItem';

export default ActionListLinkItem;
