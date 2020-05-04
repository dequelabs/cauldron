import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkRef?: React.Ref<HTMLAnchorElement>;
  variant?: 'button';
}

const Link = ({
  children,
  linkRef,
  className,
  variant,
  ...other
}: LinkProps) => (
  <a
    ref={linkRef}
    className={classNames(className, {
      'dqpl-link': !variant,
      'dqpl-button-primary': variant === 'button'
    })}
    {...other}
  >
    {children}
  </a>
);

Link.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
  linkRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

Link.displayName = 'Link';

export default Link;
