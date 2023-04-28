import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  active: boolean;
  'aria-current'?: 'page' | 'step' | 'location' | true | false;
}

const NavItem = ({
  children,
  active,
  'aria-current': ariaCurrent = true,
  ...other
}: NavItemProps): JSX.Element => {
  const additionalProps = {} as NavItemProps;

  if (active) {
    additionalProps['aria-current'] = ariaCurrent;
  }

  return (
    <li
      className={classNames('NavItem', {
        'NavItem--active': active
      })}
      {...additionalProps}
      {...other}
    >
      {children}
    </li>
  );
};

NavItem.displayName = 'NavItem';
NavItem.propTypes = {
  children: PropTypes.node.isRequired
};

export default NavItem;
