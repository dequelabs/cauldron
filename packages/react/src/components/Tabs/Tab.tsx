import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDidUpdate } from '../../index';

interface TabProps {
  value: number;
  index: number;
  children?: React.ReactNode;
}

const Tab = ({ value, index, children }: TabProps) => {
  const tabRef = useRef<HTMLLIElement>(null);
  const tabIndex = index === value ? 0 : -1;
  const selected = tabIndex === 0;

  useDidUpdate(() => {
    if (index !== value) {
      return;
    }

    tabRef?.current?.focus();
  }, [value]);

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
      {children}
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
