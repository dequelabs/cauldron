import React, { ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

interface PanelHeaderProps {
  children: ReactNode;
  className?: string;
}

const PanelHeader = ({
  children,
  className,
  ...otherProps
}: PanelHeaderProps) => {
  return (
    <div className={classNames('Panel__Header', className)} {...otherProps}>
      {children}
    </div>
  );
};

PanelHeader.displayName = 'PanelHeader';

PanelHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default PanelHeader;
