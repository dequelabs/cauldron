import React from 'react';
import classNames from 'classnames';

export type TagSize = 'default' | 'small';

interface TagProps {
  children: React.ReactNode;
  className?: string;
  size?: TagSize;
}

export const TagLabel = ({ children, className, ...other }: TagProps) => (
  <div className={classNames('Tag__label', className)} {...other}>
    {children}
  </div>
);
TagLabel.displayName = 'TagLabel';

const Tag = ({ children, className, size = 'default', ...other }: TagProps) => (
  <div
    className={classNames('Tag', className, {
      'Tag--small': size === 'small'
    })}
    {...other}
  >
    {children}
  </div>
);
Tag.displayName = 'Tag';
export default Tag;
