/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';

export interface TextFieldWrapperProps {
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

const TextFieldWrapper = ({
  className,
  onClick,
  children
}: TextFieldWrapperProps) => (
  <div onClick={onClick} className={classNames('TextFieldWrapper', className)}>
    {children}
  </div>
);

export default TextFieldWrapper;
