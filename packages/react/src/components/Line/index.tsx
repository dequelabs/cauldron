import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Line = ({ className, ...other }: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className={classNames('Line', className)} {...other} />
);

Line.propTypes = {
  className: PropTypes.string
};

Line.displayName = 'Line';

export default Line;
