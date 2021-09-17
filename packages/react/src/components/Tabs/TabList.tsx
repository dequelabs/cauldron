import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabListProps {
  children: React.ReactNode;
}

const TabList = (props: TabListProps) => {
  const { children } = props;
  return (
    <div role="tablist" className="Tablist" aria-label="Tablist">
      {children}
    </div>
  );
};

export default TabList;
