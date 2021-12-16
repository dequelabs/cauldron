import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

type Variant = 'dismiss' | 'toggle';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleBase?: boolean;
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
    (other as any).onClick = handleDismiss;
  }

  if (variant === 'toggle') {
    (other as any).onClick = onToggle;
    (other as any).role = 'switch';
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
      {variant === 'toggle' && (toggleBase ? toggleOnText : toggleOffText)}
      {variant === 'dismiss' && <Icon type="close" />}
    </Component>
  );
};
Tag.displayName = 'Tag';
Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.string,
  onDismiss: PropTypes.func
};
export default Tag;
