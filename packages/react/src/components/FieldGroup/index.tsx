import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import Icon from '../Icon';
import { addIdRef } from '../../utils/idRefs';

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
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    let ariaDescribedbyId = '';
    if (description) {
      ariaDescribedbyId = addIdRef(ariaDescribedbyId, descriptionId);
    }

    if (error) {
      ariaDescribedbyId = addIdRef(ariaDescribedbyId, errorId);
    }

    return (
      <div
        role="group"
        className={classnames('FieldGroup', className)}
        ref={ref}
        {...props}
        aria-labelledby={`${id}-label`}
        aria-describedby={ariaDescribedbyId || undefined}
      >
        <label id={`${id}-label`} className="Field__label">
          {label}
        </label>
        {description && (
          <div id={descriptionId} className="Field__description">
            {description}
          </div>
        )}
        {error && (
          <div className="Field__error" id={errorId}>
            <Icon type="caution" />
            {error}
          </div>
        )}
        {children}
      </div>
    );
  }
);

FieldGroup.displayName = 'FieldGroup';

export default FieldGroup;
