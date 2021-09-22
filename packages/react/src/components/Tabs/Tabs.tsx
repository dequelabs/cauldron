import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const left: number = 37,
  right: number = 39,
  home: number = 36,
  end: number = 35;

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
      const newIndex = Number(eventTarget.id.split('-')[1]);
      return handleChange(newIndex);
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
        break;
      }
      case right: {
        newIndex = activeIndex + 1;

        // circularity
        if (newIndex === tabCount) {
          newIndex = 0;
        }
        break;
      }
      case home: {
        newIndex = 0;
        break;
      }
      case end: {
        newIndex = tabCount - 1;
        break;
      }
    }

    setActiveIndex(newIndex);
    handleChange(newIndex);
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
