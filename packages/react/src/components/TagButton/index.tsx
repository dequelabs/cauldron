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
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TagButton = React.forwardRef(
  (
    { label, value, icon, className, ...rest }: TagButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        variant="tag"
        className={classNames('TagButton', className)}
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
