import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

type Variant = 'dismiss';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
  ...other
}: TagProps) => {
  const [show, setShow] = useState(true);
  const Component = variant === 'dismiss' ? 'button' : 'div';

  const handleDismiss = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShow(false);
    if (onDismiss) {
      onDismiss(event);
    }
  };

  if (variant === 'dismiss') {
    (other as any).onClick = handleDismiss;
  }

  return (
    <Component
      className={classNames('Tag', className, {
        'Tag--hidden': !show,
        'Tag--dismiss': variant === 'dismiss'
      })}
      {...other}
    >
      {children}
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
