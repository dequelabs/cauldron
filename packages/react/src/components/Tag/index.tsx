import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

type Variant = 'dismiss' | 'toggle';

interface TagProps
  extends React.HTMLAttributes<HTMLButtonElement | HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleBase?: boolean;
  buttonLabel?: string;
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleOnText?: string;
  toggleOffText?: string;
}

export const TagLabel = ({ children, className, ...other }: TagProps) => (
  <div className={classNames('Tag__label', className)} {...other}>
    {children}
  </div>
);
TagLabel.displayName = 'TagLabel';
TagLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

const Tag = ({
  children,
  className,
  variant,
  onDismiss,
  toggleBase,
  buttonLabel,
  toggleOnText = 'ON',
  toggleOffText = 'OFF',
  onToggle,
  ...other
}: TagProps) => {
  const [show, setShow] = useState(true);
  const Component = variant === ('dismiss' || 'toggle') ? 'button' : 'div';

  const handleDismiss = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShow(false);
    if (onDismiss) {
      onDismiss(event);
    }
  };

  if (variant === 'dismiss') {
    other.onClick = handleDismiss;
  }

  if (variant === 'toggle') {
    other.onClick = onToggle;
    other.role = 'switch';
    other['aria-label'] = buttonLabel;
    other['aria-checked'] = !!toggleBase;
  }

  return (
    <Component
      className={classNames('Tag', className, {
        'Tag--hidden': !show,
        'Tag--dismiss': variant === 'dismiss',
        'Tag--toggle': variant === 'toggle'
      })}
      {...other}
    >
      {children}
      {variant === 'toggle' && (
        <span>{toggleBase ? toggleOnText : toggleOffText}</span>
      )}
      {variant === 'dismiss' && <Icon type="close" />}
    </Component>
  );
};
Tag.displayName = 'Tag';
Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.string,
  buttonLabel: PropTypes.string,
  onDismiss: PropTypes.func,
  toggleBase: PropTypes.bool,
  onToggle: PropTypes.func,
  toggleOnText: PropTypes.string,
  toggleOffText: PropTypes.string
};
export default Tag;
