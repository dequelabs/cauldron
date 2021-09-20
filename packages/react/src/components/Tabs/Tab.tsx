import React from 'react';
import PropTypes from 'prop-types';

interface TabProps {
  label: string;
  controlPanelId: string;
  tabRef: React.Ref<HTMLButtonElement>;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const Tab = ({
  controlPanelId,
  tabRef,
  selected,
  onClick = () => null,
  children
}: TabProps) => {
  return (
    <button
      role="tab"
      className="Tab"
      aria-selected={selected}
      aria-controls={controlPanelId}
      onClick={onClick}
      ref={tabRef}
    >
      {children}
    </button>
  );
};

export default Tab;
