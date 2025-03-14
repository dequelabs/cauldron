import React, { forwardRef } from 'react';
import { ComboboxValue } from './ComboboxOption';
import TagButton from '../TagButton';
import Button from '../Button';

interface ComboboxPillProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: ComboboxValue;
  removeOptionLabel?: string;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ComboboxPill = forwardRef<HTMLButtonElement, ComboboxPillProps>(
  ({ value, removeOptionLabel, disabled = false, ...rest }, ref) => {
    const commonProps = {
      ref,
      'aria-label': removeOptionLabel ? removeOptionLabel : `remove ${value}`,
      className: 'ComboboxPill',
      tabIndex: -1
    };

    return !disabled ? (
      <TagButton
        label={value || ''}
        value=""
        icon="close"
        {...commonProps}
        {...rest}
      />
    ) : (
      <Button variant="tag" disabled={disabled} {...commonProps} {...rest}>
        {value}
      </Button>
    );
  }
);

ComboboxPill.displayName = 'ComboboxPill';

export default ComboboxPill;
