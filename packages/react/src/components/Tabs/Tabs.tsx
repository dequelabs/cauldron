import { Cauldron } from '../../types';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Tab from './Tab';
import { useId } from 'react-id-generator';
import useDidUpdate from '../../utils/use-did-update';

type TabsProps = {
  children: React.ReactNode;
  initialActiveIndex?: number;
  thin?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onChange?: ({
    activeTabIndex,
    target
  }: {
    activeTabIndex: number;
    target: HTMLLIElement | null;
  }) => void;
} & Cauldron.LabelProps;

const Tabs = ({
  children,
  thin,
  orientation = 'horizontal',
  initialActiveIndex = 0,
  className,
  onChange,
  ...labelProp
}: TabsProps): React.JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const tabsRef = useRef<HTMLDivElement>(null);

  const tabs = React.Children.toArray(children).filter(
    (child) => (child as React.ReactElement<any>).type === Tab
  );

  const tabCount = tabs.length;

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    let newIndex: number = activeIndex;

    let forward: string;
    let backward: string;
    if (orientation === 'horizontal') {
      forward = 'ArrowRight';
      backward = 'ArrowLeft';
    } else {
      forward = 'ArrowDown';
      backward = 'ArrowUp';
    }

    switch (key) {
      case backward: {
        newIndex = activeIndex - 1;

        // circularity
        if (newIndex === -1) {
          newIndex = tabCount - 1;
        }
        setActiveIndex(newIndex);
        event.preventDefault();
        break;
      }
      case forward: {
        newIndex = activeIndex + 1;

        // circularity
        if (newIndex === tabCount) {
          newIndex = 0;
        }
        setActiveIndex(newIndex);
        event.preventDefault();
        break;
      }
      case 'Home': {
        newIndex = 0;
        setActiveIndex(newIndex);
        event.preventDefault();
        break;
      }
      case 'End': {
        event.preventDefault();
        newIndex = tabCount - 1;
        setActiveIndex(newIndex);
        event.preventDefault();
        break;
      }
    }
  };

  const tabComponents = tabs.map((child, index) => {
    const {
      target,
      id: propId,
      ...other
    } = (child as React.ReactElement<any>).props;
    const selected = index === activeIndex;
    const [id] = propId ? [propId] : useId(1, 'tab');

    useEffect(() => {
      target.current?.setAttribute('aria-labelledby', id);
    }, [target]);

    useEffect(() => {
      index === activeIndex
        ? target.current?.classList.remove('TabPanel--hidden')
        : target.current?.classList.add('TabPanel--hidden');
    }, [activeIndex]);

    const config = {
      id,
      className: classNames('Tab', {
        'Tab--active': selected
      }),
      tabIndex: index === activeIndex ? 0 : -1,
      ['aria-controls']: target.current?.id,
      ['aria-selected']: selected,
      onClick: () => handleClick(index),
      ...other
    };

    return React.cloneElement(child as React.ReactElement<any>, config);
  });

  useDidUpdate(() => {
    const activeTab = tabsRef.current?.querySelector(
      ':scope > [role="tablist"] > [aria-selected="true"]'
    ) as HTMLLIElement;
    activeTab?.focus();
    if (typeof onChange === 'function') {
      onChange({ activeTabIndex: activeIndex, target: activeTab });
    }
  }, [activeIndex]);

  return (
    <div
      className={classNames('Tabs', className, {
        'Tabs--thin': thin,
        'Tabs--vertical': orientation === 'vertical',
        'Tabs--horizontal': orientation === 'horizontal'
      })}
      ref={tabsRef}
    >
      <ul
        className="Tablist"
        {...labelProp}
        onKeyDown={handleKeyDown}
      >
        {tabComponents}
      </ul>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
