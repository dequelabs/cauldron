import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType | string;
}

const FieldWrap = React.forwardRef<HTMLElement, Props>(
  ({ children, className, as: Component = 'div', ...props }, ref) => (
    <Component ref={ref} className={classNames('Panel', className)} {...props}>
      {children}
    </Component>
  )
);

FieldWrap.displayName = 'FieldWrap';
FieldWrap.propTypes = {
  // @ts-expect-error
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.string
};

export default FieldWrap;
