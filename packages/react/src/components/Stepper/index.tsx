import React from 'react';
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
      <div
        className={classNames(
          'Stepper__step-line',
          `Stepper__step--${status}-line`
        )}
      />
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
            <div
              className={classNames(
                'Stepper__step-indicator',
                `Stepper__step--${status}-indicator`
              )}
            >
              {status === 'complete' && <Icon type={'check'} />}
            </div>
          </TooltipTabstop>
        ) : (
          <>
            <div
              className={classNames(
                'Stepper__step-indicator',
                `Stepper__step--${status}-indicator`
              )}
            >
              {status === 'complete' && <Icon type={'check'} />}
            </div>

            {children ? (
              <div
                className={classNames(
                  'Stepper__step-label',
                  `Stepper__step--${status}-label`
                )}
              >
                {children}
              </div>
            ) : null}
          </>
        )}
      </div>
    </li>
  );
};

Step.displayName = 'Step';

interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode;
  className?: string;
}

const Stepper = ({ children, className, ...other }: StepperProps) => (
  <ol className={classNames('Stepper', className)} {...other}>
    {children}
  </ol>
);

Stepper.displayName = 'Stepper';

export default Stepper;
