import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import Icon from '../../Icon';

export interface FieldErrorProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Class applied to the error element. Defaults to the shared field error
   * style; `Checkbox` styles its error differently.
   */
  className?: string;
  /** Whether to render the caution icon before the message. */
  icon?: boolean;
}

/**
 * The error message for a form field, wired up as a live region.
 *
 * Field errors typically appear on submit, at which point focus has not moved.
 * Screen readers only report a changed accessible description when the element
 * it describes is re-focused, so associating the message via `aria-describedby`
 * alone leaves it silent for the very interaction that produced it.
 *
 * `role="alert"` gets the message announced as soon as it is inserted, and
 * `aria-live="polite"` stops a form that reveals several errors at once from
 * interrupting itself.
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/status-messages
 */
const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(
  (
    { children, className = 'Field__error', icon = true, ...props },
    ref
  ): React.JSX.Element => (
    <div
      className={className}
      role="alert"
      aria-live="polite"
      ref={ref}
      {...props}
    >
      {icon && <Icon type="caution" />}
      {children}
    </div>
  )
);

FieldError.displayName = 'FieldError';

export default FieldError;
