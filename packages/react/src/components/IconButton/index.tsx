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

export interface IconButtonProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLButtonElement>, 'button'> {
  icon: IconType;
  label: React.ReactNode;
  tooltipProps?: Omit<TooltipProps, 'children' | 'target'>;
  /**
   * @deprecated use `tooltipProps.placement` instead
   */
  tooltipPlacement?: TooltipProps['placement'];
  /**
   * @deprecated use `tooltipProps.variant` instead
   */
  tooltipVariant?: TooltipProps['variant'];
  /**
   * @deprecated use `tooltipProps.portal` instead
   */
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
      tooltipPlacement,
      tooltipVariant,
      tooltipPortal,
      tooltipProps: tooltipPropsProp = {},
      className,
      variant = 'secondary',
      disabled,
      tabIndex = 0,
      large,
      ...other
    }: any,
    ref
  ): JSX.Element => {
    const internalRef = useRef() as MutableRefObject<HTMLElement>;
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

    if (process.env.NODE_ENV !== 'production') {
      if (!!tooltipPlacement || !!tooltipVariant || !!tooltipPortal) {
        React.useEffect(() => {
          console.warn(
            'IconButton: The following tooltip props are deprecated: tooltipPlacement, tooltipVariant, tooltipPortal. ' +
              'See https://cauldron.dequelabs.com/components/IconButton for recommended replacement.'
          );
        }, []);
      }
    }

    const tooltipProps: Omit<TooltipProps, 'children' | 'target'> = {
      placement: tooltipPlacement || 'auto',
      variant: tooltipVariant,
      portal: tooltipPortal,
      association: 'aria-labelledby',
      hideElementOnHidden: true,
      ...tooltipPropsProp
    };

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
          <Tooltip target={internalRef} {...tooltipProps}>
            {label}
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
) as PolymorphicComponent<IconButtonProps, 'button'>;

IconButton.displayName = 'IconButton';

export default IconButton;
