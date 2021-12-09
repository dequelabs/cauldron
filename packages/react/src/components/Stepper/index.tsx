import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TooltipTabstop from '../TooltipTabstop';

interface BaseStepProps {
  status: 'current' | 'complete' | 'future';
  className?: string;
}

interface StepWithChildren extends BaseStepProps {
  children: React.ReactNode;
}

interface StepWithTooltip extends BaseStepProps {
  tooltip: React.ReactNode;
  tooltipText: string;
}

type StepProps = StepWithChildren | StepWithTooltip;

const isTooltip = (props: StepProps): props is StepWithTooltip => {
  return !!(props as StepWithTooltip).tooltip;
};

export const Step = (props: StepProps) => {
  const { status, className, ...other } = props;
  return (
    <li
      className={classNames(
        'Stepper__step',
        `Stepper__step--${status}`,
        className
      )}
      aria-current={status === 'current' ? 'step' : 'false'}
      {...other}
    >
      <div className="Stepper__step-line" />
      <div className="Stepper__step-content">
        {isTooltip(props) ? (
          <TooltipTabstop
            placement="bottom"
            tooltip={props.tooltip}
            // the pseudo content (ex: "1") is conveyed
            // by the list item's position in the set of
            // list items, therefore it is safe to clobber
            // it with the contents of the tooltip in the
            // tab stop's accessible name.
            association="aria-labelledby"
            aria-label={isTooltip(props) ? props.tooltipText : undefined}
          >
            <div className="Stepper__step-indicator" />
          </TooltipTabstop>
        ) : (
          <>
            <div className="Stepper__step-indicator" />
            {'children' in props && (
              <div className="Stepper__step-label">{props.children}</div>
            )}
          </>
        )}
      </div>
    </li>
  );
};

Step.displayName = 'Step';

Step.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipText: PropTypes.string,
  className: PropTypes.string
};

interface StepperProps {
  children: React.ReactNode;
  className?: string;
}

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
