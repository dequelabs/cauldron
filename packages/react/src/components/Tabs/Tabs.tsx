import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabsProps {
  children: React.ReactNode;
  thin?: boolean;
  className?: string;
}

const Tabs = ({ children, className, thin }: TabsProps): JSX.Element => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) =>
    setValue(newValue);

  return (
    <div
      // onChange={handleChange}
      className={classNames('Tabs', className, {
        'Tabs--thin': thin
      })}
    >
      <div role="tablist" className="Tablist" aria-label="Tablist">
        {children}
      </div>
    </div>
  );
};

export default Tabs;
