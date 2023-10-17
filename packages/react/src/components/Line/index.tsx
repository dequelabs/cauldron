import React from 'react';
import classNames from 'classnames';

const Line = ({ className, ...other }: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className={classNames('Line', className)} {...other} />
);

Line.displayName = 'Line';

export default Line;
