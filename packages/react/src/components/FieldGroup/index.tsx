import React from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';

type FieldGroupProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  /* eslint-disable-next-line */
  (
    { label, description, error, children, className, id: propId, ...props },
    ref
  ) => {
    const [id] = propId ? [propId] : useId(1, 'fieldgroup');
    return (
      <div
        role="group"
        aria-labelledby=""
        className={classnames('FieldGroup', className)}
        ref={ref}
        {...props}
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
