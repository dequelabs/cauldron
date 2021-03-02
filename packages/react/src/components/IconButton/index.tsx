import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  MutableRefObject
} from 'react';
import classnames from 'classnames';
import { Placement } from '@popperjs/core';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  tooltipPlacement?: Placement;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      tooltipPlacement = 'auto',
      className,
      ...other
    }: IconButtonProps,
    ref
  ): JSX.Element => {
    const buttonRef = useRef() as MutableRefObject<HTMLButtonElement>;
    useImperativeHandle(ref, () => buttonRef.current);

    return (
      <React.Fragment>
        <button
          type={'button'}
          className={classnames('IconButton', className)}
          ref={buttonRef}
          {...other}
        >
          <Icon type={icon} />
        </button>
        <Tooltip
          target={buttonRef}
          placement={tooltipPlacement}
          association="aria-labelledby"
          hideElementOnHidden
        >
          {label}
        </Tooltip>
      </React.Fragment>
    );
  }
);
IconButton.displayName = 'IconButton';
export default IconButton;
