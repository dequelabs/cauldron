import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface StepperProps {
  children: React.ReactNode;
  status: 'current' | 'complete' | 'future';
  className?: string;
}

export const Step = ({
  children,
  status,
  className,
  ...other
}: StepperProps) => (
  <li
    className={classNames(
      'Stepper__step',
      `Stepper__step--${status}`,
      className
    )}
    {...other}
  >
    <div className="Stepper__step-inner">
      <div className="Stepper__step-indicator">
        <div className="Stepper__step-circle" />
      </div>
      <div className="Stepper__step-label">{children}</div>
    </div>
  </li>
);

Step.displayName = 'Step';

Step.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

const Stepper = ({ children, className, ...other }: StepperProps) => (
  <ol className={classNames('Stepper', className)} {...other}>
    {children}
  </ol>
);

Stepper.displayName = 'Stepper';

Stepper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Stepper;
