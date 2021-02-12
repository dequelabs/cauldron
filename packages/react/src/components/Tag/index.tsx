import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TagProps {
  children: React.ReactNode;
  className?: string;
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

const Tag = ({ children, className, ...other }: TagProps) => (
  <div className={classNames('Tag', className)} {...other}>
    {children}
  </div>
);
Tag.displayName = 'Tag';
Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};
export default Tag;
