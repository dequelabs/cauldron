import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabPanelProps {
  id: string;
  labelledBy: string;
  children: React.ReactNode;
  hidden: boolean;
  className?: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { id, children, labelledBy, hidden, className } = props;

  return (
    <div
      tabIndex={0}
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      hidden={hidden}
      className={classNames('TabPanel', className)}
    >
      {children}
    </div>
  );
};

export default TabPanel;
