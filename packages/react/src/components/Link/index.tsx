import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkRef?: React.Ref<HTMLAnchorElement>;
  variant?: 'button' | 'button-secondary';
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
      Link: !variant,
      'Button--primary': variant === 'button',
      'Button--secondary': variant === 'button-secondary'
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
