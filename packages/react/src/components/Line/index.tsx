import React from 'react';
import classNames from 'classnames';

interface LineProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
}

const Line = ({ className, ...other }: LineProps) => (
  <hr className={classNames('Line', className)} {...other} />
);

Line.displayName = 'Line';

export default Line;
