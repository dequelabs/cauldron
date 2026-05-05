import React, { type ButtonHTMLAttributes, Ref } from 'react';
import Icon, { IconType } from '../Icon';
import { ContentNode } from '../../types';
import { TagLabel, type TagSize } from '../Tag';
import classNames from 'classnames';
import Button from '../Button';

interface TagButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> {
  label: ContentNode;
  value: ContentNode;
  icon: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: TagSize;
}

const TagButton = React.forwardRef(
  (
    { label, value, icon, className, size, ...rest }: TagButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        variant="tag"
        className={classNames('TagButton', className)}
        size={size}
        ref={ref}
        {...rest}
      >
        <TagLabel>{label}</TagLabel>
        {value}
        <Icon className="TagButton__icon" type={icon} />
      </Button>
    );
  }
);

TagButton.displayName = 'TagButton';

export default TagButton;
