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

TabPanel.displayName = 'TabPanel';
TabPanel.Proptypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node,
  className: PropTypes.string
};

export default TabPanel;
