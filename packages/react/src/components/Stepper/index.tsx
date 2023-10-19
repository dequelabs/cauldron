import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TooltipTabstop from '../TooltipTabstop';
import Icon from '../Icon';

interface BaseStepProps extends React.LiHTMLAttributes<HTMLLIElement> {
  status: 'current' | 'complete' | 'future';
}

interface StepWithChildren extends BaseStepProps {
  children: React.ReactNode;
}

interface StepWithTooltip extends BaseStepProps {
  tooltip: React.ReactNode;
  tooltipText: string;
}

type StepProps = StepWithChildren | StepWithTooltip;

const isTooltipProps = (props: unknown): props is StepWithTooltip => {
  return !!(props as StepWithTooltip).tooltip;
};

export const Step = (props: StepProps) => {
  const { children, status, className, ...other } = props;
  let tooltip: React.ReactNode | undefined;
  let tooltipText: string | undefined;
  let liProps: React.LiHTMLAttributes<HTMLLIElement>;
  const isTooltip = isTooltipProps(other);

  if (isTooltip) {
    ({ tooltip, tooltipText, ...liProps } = other as StepWithTooltip);
  } else {
    liProps = other;
  }

  return (
    <li
      className={classNames(
        'Stepper__step',
        `Stepper__step--${status}`,
        className
      )}
      aria-current={status === 'current' ? 'step' : 'false'}
      {...liProps}
    >
      <div className="Stepper__step-line" />
      <div className="Stepper__step-content">
        {isTooltip ? (
          <TooltipTabstop
            placement="bottom"
            tooltip={tooltip}
            // the pseudo content (ex: "1") is conveyed
            // by the list item's position in the set of
            // list items, therefore it is safe to clobber
            // it with the contents of the tooltip in the
            // tab stop's accessible name.
            association="aria-labelledby"
            aria-label={tooltipText}
          >
            <div className="Stepper__step-indicator">
              {props.status === 'complete' && <Icon type={'check'} />}
            </div>
          </TooltipTabstop>
        ) : (
          <>
            <div className="Stepper__step-indicator">
              {props.status === 'complete' && <Icon type={'check'} />}
            </div>

            {children ? (
              <div className="Stepper__step-label">{children}</div>
            ) : null}
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
