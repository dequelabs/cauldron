import React, { Ref } from 'react';
import Icon, { IconType } from '../Icon';
import { ContentNode } from '../../types';
import { TagLabel } from '../Tag';
import classNames from 'classnames';
import Button from '../Button';

interface TagButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: ContentNode;
  value: ContentNode;
  icon: IconType;
  position?: 'left' | 'right' | 'center';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TagButton = React.forwardRef(
  (
    {
      label,
      value,
      icon,
      position = 'right',
      className,
      ...rest
    }: TagButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        variant="tag"
        className={classNames('TagButton', className)}
        ref={ref}
        {...rest}
      >
        {position === 'left' && (
          <Icon
            className={classNames('TagButton__icon', 'Icon-left')}
            type={icon}
          />
        )}
        <TagLabel>{label}</TagLabel>
        {position === 'center' && (
          <Icon
            className={classNames('TagButton__icon', 'Icon-center')}
            type={icon}
          />
        )}
        {value}
        {position === 'right' && (
          <Icon
            className={classNames('TagButton__icon', 'Icon-right')}
            type={icon}
          />
        )}
      </Button>
    );
  }
);

TagButton.displayName = 'TagButton';

export default TagButton;
