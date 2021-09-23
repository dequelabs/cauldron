import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  panelValue: number;
  children?: React.ReactNode;
  className?: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, index, panelValue, className, ...other } = props;

  return (
    <div
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      role="tabpanel"
      className={classNames('TabPanel', className, {
        'TabPanel--hidden': panelValue !== index
      })}
      {...other}
    >
      {children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';
TabPanel.Proptypes = {
  index: PropTypes.number.isRequired,
  panelValue: PropTypes.number.isRequired,
  children: PropTypes.node,
  className: PropTypes.string
};

export default TabPanel;
