import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';

interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
}

const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(
  (
    { label, description, error, children, className, id: propId, ...props },
    ref
  ) => {
    const [id] = propId ? [propId] : useId(1, 'fieldgroup');
    const groupProps = description
      ? { 'aria-describedby': `${id}-description`, ...props }
      : props;
    return (
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        className={classnames('FieldGroup', className)}
        ref={ref}
        {...groupProps}
      >
        <label id={`${id}-label`} className="Field__label">
          {label}
        </label>
        {description && (
          <div id={`${id}-description`} className="Field__description">
            {description}
          </div>
        )}
        {error && <div className="Field__error">{error}</div>}
        {children}
      </div>
    );
  }
);

FieldGroup.displayName = 'FieldGroup';

export default FieldGroup;
