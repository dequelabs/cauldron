import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
  className?: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, index, value, className, ...other } = props;

  return (
    <div
      tabIndex={0}
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      role="tabpanel"
      className={classNames('TabPanel', className)}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default TabPanel;
