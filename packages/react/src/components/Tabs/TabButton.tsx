import React from 'react';
import PropTypes from 'prop-types';

interface TabButtonProps {
  id: string;
  name: string;
  controlPanelId: string;
  tabRef: React.Ref<HTMLButtonElement>;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const TabButton = ({
  id,
  name,
  controlPanelId,
  tabRef,
  selected,
  onClick = () => null,
  children
}: TabButtonProps) => {
  return (
    <button
      role="tab"
      className="TabButton"
      id={id}
      aria-selected={selected}
      aria-controls={controlPanelId}
      onClick={onClick}
      ref={tabRef}
    >
      {name || children}
    </button>
  );
};

export default TabButton;
