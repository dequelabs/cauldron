import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const left: number = 37,
  right: number = 39,
  tab: number = 9,
  home: number = 36,
  end: number = 35,
  deleteKey: number = 46;

interface TargetElement extends EventTarget {
  id?: string;
}

interface TabsProps {
  value: number;
  children: React.ReactNode;
  handleChange: (newValue: number) => void;
  thin?: boolean;
  className?: string;
}

const Tabs = ({
  value,
  children,
  className,
  thin,
  handleChange
}: TabsProps): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(value);
  const tabCount = React.Children.toArray(children).length;
  const handleClick = (event: React.MouseEvent) => {
    const eventTarget: TargetElement = event.target;
    if (eventTarget.id?.includes('tab-')) {
      const index = Number(eventTarget.id.split('-')[1]);
      return handleChange(index);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { which, target } = event;
    switch (which) {
      case left: {
      }
    }
  };

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
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {children}
      </ul>
    </div>
  );
};

export default Tabs;
