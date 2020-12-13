import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// @ts-ignore
import { BrowserRouter, Link as RouterLink } from 'react-router-dom';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkRef?: React.Ref<HTMLAnchorElement>;
  reactRouter?: false;
  variant?: 'button';
  useRouter?: false;
}

const Link = ({
  children,
  linkRef,
  className,
  variant,
  useRouter,
  ...other
}: LinkProps) =>
  useRouter ? (
    <BrowserRouter>
      <RouterLink
        ref={linkRef}
        className={classNames(className, {
          Link: !variant,
          'Button--primary': variant === 'button'
        })}
        {...other}
      >
        {children}
      </RouterLink>
    </BrowserRouter>
  ) : (
    <a
      ref={linkRef}
      className={classNames(className, {
        Link: !variant,
        'Button--primary': variant === 'button'
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
  useRouter: PropTypes.bool,
  linkRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

Link.displayName = 'Link';

export default Link;
