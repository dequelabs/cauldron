import React from 'react';
import classNames from 'classnames';
import type {
  PolymorphicComponent,
  PolymorphicProps
} from '../../utils/polymorphicComponent';

interface FieldWrapProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  children: React.ReactNode;
}

const FieldWrap = React.forwardRef<HTMLElement, FieldWrapProps>(
  ({ children, className, as: Component = 'div', ...props }, ref) => (
    <Component ref={ref} className={classNames('Panel', className)} {...props}>
      {children}
    </Component>
  )
) as PolymorphicComponent<FieldWrapProps>;

FieldWrap.displayName = 'FieldWrap';

export default FieldWrap;
