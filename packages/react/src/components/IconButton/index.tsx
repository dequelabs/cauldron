import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  MutableRefObject
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';
import Tooltip, { TooltipProps } from '../Tooltip';

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  tooltipPlacement?: TooltipProps['placement'];
  tooltipVariant?: TooltipProps['variant'];
  tooltipPortal?: TooltipProps['portal'];
  variant?: 'primary' | 'secondary' | 'error';
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      tooltipPlacement = 'auto',
      tooltipVariant,
      tooltipPortal,
      className,
      variant = 'secondary',
      disabled,
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
          className={classnames(className, {
            IconButton: true,
            'IconButton--primary': variant === 'primary',
            'IconButton--secondary': variant === 'secondary',
            'IconButton--error': variant === 'error'
          })}
          ref={buttonRef}
          disabled={disabled}
          {...other}
        >
          <Icon type={icon} />
        </button>
        {!disabled && (
          <Tooltip
            target={buttonRef}
            placement={tooltipPlacement}
            variant={tooltipVariant}
            portal={tooltipPortal}
            association="aria-labelledby"
            hideElementOnHidden
          >
            {label}
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
);

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  // @ts-ignore
  tooltipPlacement: PropTypes.string,
  // @ts-ignore
  tooltipVariant: PropTypes.string,
  tooltipPortal: PropTypes.any,
  // @ts-ignore
  variant: PropTypes.string
};

IconButton.displayName = 'IconButton';

export default IconButton;
