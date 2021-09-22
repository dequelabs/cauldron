import React from 'react';
import PropTypes from 'prop-types';

interface TabProps {
  label: string;
  index: number;
  children: React.ReactNode;
}

const Tab = ({ label, index, children }: TabProps) => {
  return (
    <li
      role="tab"
      className="Tab"
      id={`tab-${index}`}
      aria-controls={`tabpanel-${index}`}
    >
      {label || children}
    </li>
  );
};

export default Tab;
