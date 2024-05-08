import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

export interface TextFieldWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const TextFieldWrapper = forwardRef<HTMLDivElement, TextFieldWrapperProps>(
  ({ className, children, ...otherProps }: TextFieldWrapperProps, ref) => (
    <div
      className={classNames('TextFieldWrapper', className)}
      {...otherProps}
      ref={ref}
    >
      {children}
    </div>
  )
);

TextFieldWrapper.displayName = 'TextFieldWrapper';

export default TextFieldWrapper;
