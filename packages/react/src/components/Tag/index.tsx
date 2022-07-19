import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  onToggle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'toggle' | 'default';
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
  onToggle,
  variant = 'default',
  ...other
}: TagProps) => {
  if (variant === 'toggle') {
    return (
      <button
        className={classNames('Tag', className)}
        {...other}
        onClick={onToggle}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classNames('Tag', className)} {...other}>
      {children}
    </div>
  );
};

Tag.displayName = 'Tag';
Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onToggle: PropTypes.func,
  variant: PropTypes.oneOf(['toggle', 'default'])
};
export default Tag;
