import { Cauldron } from '../../types';
import React, { forwardRef } from 'react';
import classnames from 'classnames';

type ProgressBarProps = {
  progress: number;
  progressMax?: number;
  progressMin?: number;
  thin?: boolean;
} & Cauldron.LabelProps &
  React.HTMLAttributes<HTMLDivElement>;

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    { progress = 0, progressMax = 100, progressMin = 0, thin, ...props },
    ref
  ) => {
    const { className, ...otherProps } = props;
    return (
      <div
        className={classnames(className, 'ProgressBar', {
          'ProgressBar--thin': thin
        })}
        role="progressbar"
        aria-valuemin={progressMin}
        aria-valuemax={progressMax}
        aria-valuenow={progress}
        ref={ref}
        {...otherProps}
      >
        <div
          className="ProgressBar--fill"
          style={{ width: `${Math.min((progress / progressMax) * 100, 100)}%` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
