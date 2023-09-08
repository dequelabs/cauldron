import React, { HTMLProps } from 'react';
import Icon, { IconType } from '../Icon';
import { ContentNode } from '../../types';
import Tag, { TagLabel } from '../Tag';
import classNames from 'classnames';
import Button from '../Button';

interface TagButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: ContentNode;
  value: ContentNode;
  icon: IconType;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const TagButton = ({
  label,
  value,
  icon,
  action,
  className,
  disabled,
  ...rest
}: TagButtonProps) => {
  const accessibilityProps: HTMLProps<HTMLElement> = {};

  if (disabled) {
    accessibilityProps['aria-disabled'] = disabled;
  }

  return disabled === undefined ? (
    <Tag
      {...rest}
      {...accessibilityProps}
      className={classNames('TagButton', 'TagButton-disabled', className)}
    >
      <TagLabel>{label}</TagLabel>
      {value}
      <Icon className="TagButton__icon" type={icon} />
    </Tag>
  ) : (
    <Button
      {...rest}
      variant="tag"
      className={classNames('TagButton', className)}
      onClick={action}
      disabled={disabled}
    >
      <TagLabel>{label}</TagLabel>
      {value}
      <Icon className="TagButton__icon" type={icon} />
    </Button>
  );
};

TagButton.displayName = 'TagButton';

export default TagButton;
