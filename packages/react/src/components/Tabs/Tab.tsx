import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabProps {
  value: number;
  index: number;
  label?: string;
  children?: React.ReactNode;
}

const Tab = ({ value, label, index, children }: TabProps) => {
  const tabRef = useRef<HTMLLIElement>(null);
  const tabIndex = index === value ? 0 : -1;
  const selected = tabIndex === 0;
  if (selected) {
    tabRef?.current?.focus();
  }

  return (
    <li
      role="tab"
      className={classNames('Tab', {
        'Tab--active': selected
      })}
      id={`tab-${index}`}
      aria-controls={`tabpanel-${index}`}
      tabIndex={tabIndex}
      aria-selected={selected}
      ref={tabRef}
    >
      {label || children}
    </li>
  );
};

Tab.displayName = 'Tab';
Tab.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
  label: PropTypes.string
};

export default Tab;
