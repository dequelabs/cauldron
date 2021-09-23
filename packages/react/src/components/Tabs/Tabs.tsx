import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const [left, right, home, end] = [37, 39, 36, 35];

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
  handleChange,
  thin,
  className
}: TabsProps): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(value);
  const tabCount = React.Children.toArray(children).length;

  const handleClick = (event: React.MouseEvent) => {
    const eventTarget: TargetElement = event.target;
    if (eventTarget.id?.includes('tab-')) {
      const newIndex = Number(eventTarget.id.split('-')[1]);
      setActiveIndex(newIndex);
      handleChange(newIndex);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { which } = event;
    let newIndex: number = activeIndex;

    switch (which) {
      case left: {
        newIndex = activeIndex - 1;

        // circularity
        if (newIndex === -1) {
          newIndex = tabCount - 1;
        }
        setActiveIndex(newIndex);
        handleChange(newIndex);
        break;
      }
      case right: {
        newIndex = activeIndex + 1;

        // circularity
        if (newIndex === tabCount) {
          newIndex = 0;
        }
        setActiveIndex(newIndex);
        handleChange(newIndex);
        break;
      }
      case home: {
        newIndex = 0;
        setActiveIndex(newIndex);
        handleChange(newIndex);
        break;
      }
      case end: {
        newIndex = tabCount - 1;
        setActiveIndex(newIndex);
        handleChange(newIndex);
        break;
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

Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  value: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  handleChange: PropTypes.func.isRequired,
  thin: PropTypes.bool,
  className: PropTypes.string
};

export default Tabs;
