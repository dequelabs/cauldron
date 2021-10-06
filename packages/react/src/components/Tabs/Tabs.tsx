import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDidUpdate } from '../../index';
import Tab from './Tab';
import { useEffect } from 'react';

type TabsVariant = 'full-width';
type LabelProps = { 'aria-label': string } | { 'aria-labelledby': string };

type TabsProps = {
  children: React.ReactNode;
  initialActiveIndex?: number;
  thin?: boolean;
  className?: string;
  variant?: TabsVariant;
} & LabelProps;

const Tabs = ({
  children,
  thin,
  initialActiveIndex = 0,
  variant,
  className,
  ...labelProp
}: TabsProps): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const focusedTabRef = useRef<HTMLLIElement>(null);

  const tabs = React.Children.toArray(children).filter(
    child => (child as React.ReactElement<any>).type === Tab
  );

  const tabCount = tabs.length;

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    let newIndex: number = activeIndex;

    switch (key) {
      case 'ArrowLeft': {
        newIndex = activeIndex - 1;

        // circularity
        if (newIndex === -1) {
          newIndex = tabCount - 1;
        }
        setActiveIndex(newIndex);
        break;
      }
      case 'ArrowRight': {
        newIndex = activeIndex + 1;

        // circularity
        if (newIndex === tabCount) {
          newIndex = 0;
        }
        setActiveIndex(newIndex);
        break;
      }
      case 'Home': {
        newIndex = 0;
        setActiveIndex(newIndex);
        break;
      }
      case 'End': {
        event.preventDefault();
        newIndex = tabCount - 1;
        setActiveIndex(newIndex);
        break;
      }
    }
  };

  const tabComponents = tabs.map((child, index) => {
    const { targetref, id, ...other } = (child as React.ReactElement<
      any
    >).props;
    const selected = index === activeIndex;

    useEffect(() => {
      targetref.current.setAttribute('aria-controlledby', id);
    }, [targetref]);

    useEffect(() => {
      index === activeIndex
        ? targetref.current.classList.remove('TabPanel--hidden')
        : targetref.current.classList.add('TabPanel--hidden');
    }, [activeIndex]);

    const config = {
      className: classNames('Tab', {
        'Tab--active': selected,
        'Tab--full-width': variant === 'full-width'
      }),
      tabIndex: index === activeIndex ? 0 : -1,
      ['aria-controls']: targetref.current?.id,
      ['aria-selected']: selected,
      ref: index === activeIndex ? focusedTabRef : null,
      onClick: () => handleClick(index),
      ...other
    };

    return React.cloneElement(child as React.ReactElement<any>, config);
  });

  // const tabPanelComponents = panels.map((child, index) => {
  //   const { className, ...other } = (child as React.ReactElement<any>).props;
  //   const panelId = `${id}-panel-${index}`;
  //   return React.cloneElement(child as React.ReactElement<any>, {
  //     id: panelId,
  //     ['aria-labelledby']: `${id}-${index}`,
  //     className: classNames('TabPanel', className, {
  //       'TabPanel--hidden': activeIndex !== index
  //     }),
  //     ...other
  //   });
  // });

  useDidUpdate(() => {
    focusedTabRef.current?.focus();
  }, [activeIndex]);

  return (
    <div
      className={classNames('Tabs', className, {
        'Tabs--thin': thin
      })}
    >
      <ul
        role="tablist"
        className={classNames('Tablist', {
          'Tablist--full-width': variant === 'full-width'
        })}
        {...labelProp}
        onKeyDown={handleKeyDown}
      >
        {tabComponents}
      </ul>
    </div>
  );
};

Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
  labelledby: PropTypes.string,
  id: PropTypes.string,
  initialActiveIndex: PropTypes.number,
  thin: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.string
};

export default Tabs;
