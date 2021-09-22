import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabsProps {
  children: React.ReactNode;
  thin?: boolean;
  className?: string;
  handleChange: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const Tabs = ({
  children,
  className,
  thin,
  handleChange
}: TabsProps): JSX.Element => {
  return (
    <div
      className={classNames('Tabs', className, {
        'Tabs--thin': thin
      })}
    >
      <ul
        role="tablist"
        className="Tablist"
        aria-label="Tablist"
        onClick={handleChange}
        onKeyDown={handleChange}
        tabIndex={0}
      >
        {children}
      </ul>
    </div>
  );
};

export default Tabs;
