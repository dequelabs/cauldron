import React from 'react';
import PropTypes from 'prop-types';
import { useId } from 'react-id-generator';

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  ref: React.RefObject<HTMLDivElement>;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const TabPanel = ({ children, id: propId, ...other }: TabPanelProps) => {
  const [id] = propId ? [propId] : useId(1, 'tabpanel');
  return (
    <div role="tabpanel" id={id} {...other}>
      {children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';
TabPanel.Proptypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TabPanel;
