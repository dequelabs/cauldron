import React from 'react';
import PropTypes from 'prop-types';

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const TabPanel = ({ children, ...other }: TabPanelProps) => (
  <div role="tabpanel" {...other}>
    {children}
  </div>
);

TabPanel.displayName = 'TabPanel';
TabPanel.Proptypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TabPanel;
