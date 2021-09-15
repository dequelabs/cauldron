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

const TabButton = (props: TabButtonProps) => {
  const { id, name, selected } = props;
  return (
    <button
      role="tab"
      className="TabButton"
      id={id}
      aria-selected={selected}
      aria-controls={`${id}-panel`}
    >
      {name}
    </button>
  );
};

export default TabButton;
