import React from 'react';
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

export default FieldWrap;
