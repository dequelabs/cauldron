import React from 'react';
import classNames from 'classnames';

export interface TextFieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const TextFieldWrapper = ({
  className,
  children,
  ...otherProps
}: TextFieldWrapperProps) => (
  <div className={classNames('TextFieldWrapper', className)} {...otherProps}>
    {children}
  </div>
);

export default TextFieldWrapper;
