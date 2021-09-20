import React from 'react';
import PropTypes from 'prop-types';

interface TabProps {
  label: string;
  index: number;
  children: React.ReactNode;
}

const Tab = ({ label, index, children }: TabProps) => {
  return (
    <div
      role="tab"
      className="Tab"
      id={`tab-${index}`}
      aria-controls={`tabpanel-${index}`}
    >
      {children}
    </div>
  );
};

export default Tab;
