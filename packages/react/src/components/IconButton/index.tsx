import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  MutableRefObject,
  HTMLProps
} from 'react';
import classnames from 'classnames';
import Icon, { IconType } from '../Icon';
import Tooltip, { TooltipProps } from '../Tooltip';
import Offscreen from '../Offscreen';
import {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';
import { HTMLAttributes } from 'enzyme';

export interface IconButtonProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLButtonElement>, 'button'> {
  icon: IconType;
  label: React.ReactNode;
  tooltipPlacement?: TooltipProps['placement'];
  tooltipVariant?: TooltipProps['variant'];
  tooltipPortal?: TooltipProps['portal'];
  variant?: 'primary' | 'secondary' | 'error';
  large?: boolean;
}

const IconButton = forwardRef(
  (
    {
      as: Component = 'button',
      icon,
      label,
      tooltipPlacement = 'auto',
      tooltipVariant,
      tooltipPortal,
      className,
      variant = 'secondary',
      disabled,
      tabIndex = 0,
      large,
      ...other
    }: any,
    ref
  ): JSX.Element => {
    const internalRef = useRef() as MutableRefObject<any>;
    useImperativeHandle(ref, () => internalRef.current);

    // Configure additional properties based on the type of the Component
    // for accessibility
    const accessibilityProps: HTMLProps<HTMLElement> = {};
    if (Component === 'button') {
      accessibilityProps.type = 'button';
    } else {
      // We don't need to set an anchor's role, since it would be redundant
      if (Component !== 'a') {
        accessibilityProps.role = other.href || other.to ? 'link' : 'button';
      }
      if (disabled) {
        accessibilityProps['aria-disabled'] = disabled;
      }
    }

    return (
      <React.Fragment>
        <Component
          className={classnames(className, {
            IconButton: true,
            'IconButton--primary': variant === 'primary',
            'IconButton--secondary': variant === 'secondary',
            'IconButton--error': variant === 'error',
            'IconButton--large': large
          })}
          ref={internalRef}
          disabled={disabled}
          tabIndex={disabled ? -1 : tabIndex}
          {...accessibilityProps}
          {...other}
        >
          <Icon type={icon} />
          {disabled && <Offscreen>{label}</Offscreen>}
        </Component>
        {!disabled && (
          <Tooltip
            target={internalRef}
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
) as PolymorphicComponent<IconButtonProps, 'button'>;

IconButton.displayName = 'IconButton';

export default IconButton;
