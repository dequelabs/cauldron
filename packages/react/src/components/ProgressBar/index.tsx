import React from 'react';
import PropTypes from 'prop-types';

interface ProgressBar extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  progress: number;
}

function ProgressBar({
  label,
  progress = 0,
  ...props
}: ProgressBar): JSX.Element {
  return (
    <div
      className="ProgressBar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={label}
      {...props}
    >
      <div
        className="ProgressBar--fill"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
