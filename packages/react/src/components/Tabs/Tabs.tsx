import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface TabsProps {
  children: React.ReactNode;
  thin?: boolean;
  className?: string;
}

const Tabs = ({ thin, children, className }: TabsProps): JSX.Element => {
  const tabs = useRef<HTMLButtonElement[]>([]);
  const onTabButtonClick = () => null;

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
