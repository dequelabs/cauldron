import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useId } from 'react-id-generator';
import { useDidUpdate } from '../../index';
import TabPanel from './TabPanel';
import Tab from './Tab';

const [left, right, home, end] = [37, 39, 36, 35];

interface TargetElement extends EventTarget {
  id?: string;
}

interface TabsProps {
  value: number;
  children: React.ReactNode;
  handleChange: (newValue: number) => void;
  id?: string;
  thin?: boolean;
  className?: string;
  ariaLabelForTablist?: string;
}

const Tabs = ({
  id: propId,
  value,
  children,
  handleChange,
  thin,
  className,
  ariaLabelForTablist
}: TabsProps): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(value);
  const [id] = propId ? [propId] : useId(1, 'tabs');
  const focusedTabRef = useRef<HTMLLIElement>(null);

  const tabs = React.Children.toArray(children).filter(
    child => (child as React.ReactElement<any>).type === Tab
  );
  const panels = React.Children.toArray(children).filter(
    child => (child as React.ReactElement<any>).type === TabPanel
  );

  const tabCount = tabs.length;

  const handleClick = (event: React.MouseEvent) => {
    const eventTarget: TargetElement = event.target;
    if (eventTarget.id?.includes(id)) {
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

  const tabComponents = tabs.map((child, index) => {
    const { ...other } = (child as React.ReactElement<any>).props;
    const selected = index === value;

    const config = {
      id: `${id}-${index}`,
      className: classNames('Tab', {
        'Tab--active': selected
      }),
      tabIndex: index === value ? 0 : -1,
      ['aria-controls']: `${id}-panel-${index}`,
      ['aria-selected']: selected,
      ref: index === value ? focusedTabRef : null,
      ...other
    };

    return React.cloneElement(child as React.ReactElement<any>, config);
  });

  const tabPanelComponents = panels.map((child, index) => {
    const { className, ...other } = (child as React.ReactElement<any>).props;
    const panelId = `${id}-panel-${index}`;
    return React.cloneElement(child as React.ReactElement<any>, {
      id: panelId,
      ['aria-labelledby']: `${id}-${index}`,
      className: classNames('TabPanel', className, {
        'TabPanel--hidden': value !== index
      }),
      ...other
    });
  });

  useDidUpdate(() => {
    focusedTabRef.current?.focus();
  }, [value]);

  return (
    <div
      className={classNames('Tabs', className, {
        'Tabs--thin': thin
      })}
    >
      <ul
        role="tablist"
        className="Tablist"
        aria-label={ariaLabelForTablist || 'Tablist'}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {tabComponents}
      </ul>
      {tabPanelComponents}
    </div>
  );
};

Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  value: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  handleChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  thin: PropTypes.bool,
  className: PropTypes.string,
  ariaLabelForTablist: PropTypes.string
};

export default Tabs;
