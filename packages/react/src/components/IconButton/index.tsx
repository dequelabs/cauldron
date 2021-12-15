/**
 * Unfortunately, eslint does not recognize the Polymorphic component has propTypes set
 *
 * We might be able to remove this if we upgrade eslint and associated plugins
 * See: https://github.com/dequelabs/cauldron/issues/451
 */
/* eslint-disable react/prop-types */
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  MutableRefObject,
  HTMLProps,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as Polymorphic from '../../utils/polymorphic-type';
import Icon, { IconType } from '../Icon';
import Tooltip, { TooltipProps } from '../Tooltip';

export interface IconButtonOwnProps {
  icon: IconType;
  label: string;
  tooltipPlacement?: TooltipProps['placement'];
  tooltipVariant?: TooltipProps['variant'];
  tooltipPortal?: TooltipProps['portal'];
  variant?: 'primary' | 'secondary' | 'error';
}

type PolymorphicIconButton = Polymorphic.ForwardRefComponent<
  'button',
  IconButtonOwnProps
>;

/**
 * Unfortunately, eslint does not recognize that this Polymorphic component has a displayName set
 *
 * We might be able to remove this if we upgrade eslint and associated plugins
 * See: https://github.com/dequelabs/cauldron/issues/451
 */
// eslint-disable-next-line react/display-name
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

    useEffect(() => {
      if (!disabled) {
        return;
      }
      internalRef.current?.setAttribute('aria-label', label);
    }, [disabled]);

    return (
      <React.Fragment>
        <Component
          className={classnames(className, {
            IconButton: true,
            'IconButton--primary': variant === 'primary',
            'IconButton--secondary': variant === 'secondary',
            'IconButton--error': variant === 'error'
          })}
          ref={internalRef}
          disabled={disabled}
          tabIndex={disabled ? -1 : tabIndex}
          {...accessibilityProps}
          {...other}
        >
          <Icon type={icon} />
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
) as PolymorphicIconButton;

IconButton.propTypes = {
  // @ts-expect-error
  as: PropTypes.elementType,
  // @ts-expect-error
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  // @ts-expect-error
  tooltipPlacement: PropTypes.string,
  // @ts-expect-error
  tooltipVariant: PropTypes.string,
  tooltipPortal: PropTypes.any,
  // @ts-expect-error
  variant: PropTypes.string
};

IconButton.displayName = 'IconButton';

export default IconButton;
