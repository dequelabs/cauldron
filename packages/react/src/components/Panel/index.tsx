import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '../IconButton';

const Panel = ({
  className,
  title,
  actions,
  children
}: {
  className: string;
  title: string;
  actions?: typeof IconButton[];
  children: React.ReactNode;
}) => {
  return (
    <div className={classNames('Panel', className)}>
      <div className="Panel__Header">{title}</div>
      <div className="Panel__Content">{children}</div>
    </div>
  );
};

Panel.displayName = 'Panel';
Panel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Panel;
