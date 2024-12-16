import React from 'react';
import clickLink from '../MenuItem/click-link';

export interface SideBarItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  className?: string;
  autoClickLink?: boolean;
}

const SideBarItem: React.ComponentType<
  React.PropsWithChildren<SideBarItemProps>
> = ({ children, autoClickLink = true, ...other }: SideBarItemProps) => {
  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!autoClickLink) {
      return;
    }

    clickLink(e.target as HTMLElement);
  };
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
  return (
    <li onClick={onClick} {...other}>
      {children}
    </li>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
};

SideBarItem.displayName = 'SideBarItem';

export default SideBarItem;
