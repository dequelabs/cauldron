import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabsProps {
  children: React.ReactNode;
  thin?: boolean;
  className?: string;
}

const Tabs = (props: TabsProps): JSX.Element => {
  const { thin, children, className } = props;

  return (
    <div
      className={classNames('Tabs', className, {
        'Tabs--thin': thin
      })}
    >
      {children}
    </div>
  );
};

export default Tabs;
