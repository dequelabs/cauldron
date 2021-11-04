import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import NavItem from './NavItem';
import NavBarTrigger from './NavBarTrigger';
import { isNarrow } from '../../utils/viewport';
import Scrim from '../Scrim';
import Icon from '../Icon';

interface NavBarProps {
  children: React.ReactNode;
  initialActiveIndex?: number;
  className?: string;
  navTriggerChildren?: string | ReactNode;
  limit?: number | null;
}

interface NavBarTriangleProps {
  direction: 'previous' | 'next';
}

const NavBar = ({
  children,
  // no initial link as default
  initialActiveIndex = -1,
  className,
  navTriggerChildren = 'MAIN MENU',
  limit = null
}: NavBarProps) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [showTrigger, setShowTrigger] = useState(isNarrow());
  const [showDropdown, setShowDropdown] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const navItems = React.Children.toArray(children).filter(child => {
    return (child as React.ReactElement<any>).type === NavItem;
  });

  const navItemCount = navItems.length;

  const handleClick = (index: number) => {
    setActiveIndex(index);
    // closes dropdown when a menu is selected
    if (showTrigger) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleWindowResize = useCallback(() => {
    const narrow = isNarrow();
    setShowTrigger(narrow);
    // close dropdown when viewport is enlarged
    if (!narrow) {
      setShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  useEffect(() => {
    // no pagination when trigger shows
    if (showTrigger) {
      setShowPrevious(false);
      setShowNext(false);
      return;
    }
    // no pagination when no limit
    if (!limit) {
      setShowPrevious(false);
      setShowNext(false);
      return;
    }
    // no pagination when item count is smaller than limit
    if (navItemCount <= limit) {
      setShowPrevious(false);
      setShowNext(false);
      return;
    }

    offset + limit < navItemCount
      ? // show next when next offest does not reach item count
        setShowNext(true)
      : // hide next when next offest reaches item count
        setShowNext(false);

    offset > 0
      ? // show previous when offset is bigger than 0
        setShowPrevious(true)
      : // hide previous when offset is back to 0
        setShowPrevious(false);
  }, [limit, offset, showTrigger]);

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  const navItemComponents = navItems
    .filter((child, index) => {
      // use pagination when there is a limit and no trigger
      if (limit && !showTrigger) {
        const nextOffset = offset + limit;
        return index >= offset && index < nextOffset;
      }
      return child;
    })
    .map((child, index) => {
      const config = {
        className: classNames('NavItem', {
          // calculate index in unfiltered array of nav items
          'NavItem--active': index + offset === activeIndex,
          'NavItem--paginated': limit && !showTrigger && navItemCount > limit
        }),
        onClick: () => handleClick(index + offset),
        ...(child as React.ReactElement<any>).props
      };

      return React.cloneElement(child as React.ReactElement<any>, config);
    });

  const navItemComponentsWithTrigger = (
    <>
      <NavBarTrigger
        show={showDropdown}
        handleTriggerClick={handleTriggerClick}
      >
        {navTriggerChildren}
      </NavBarTrigger>
      {showDropdown && navItemComponents}
    </>
  );

  const navBarTriangle = ({ direction }: NavBarTriangleProps) => {
    const handleTriangleClick = () => {
      if (!limit) {
        return;
      }

      if (direction === 'previous') {
        // the minimum offset is 0
        const nextOffset = offset - limit;
        setOffset(nextOffset < 0 ? 0 : nextOffset);
      }

      if (direction === 'next') {
        // the maximum offset is navItemCount minus limit
        const nextOffset = offset + limit;
        setOffset(nextOffset > navItemCount ? offset : nextOffset);
      }
    };

    return (
      <NavItem
        onClick={handleTriangleClick}
        className={`NavItem--${direction}`}
      >
        {direction === 'previous' ? (
          <Icon type="triangle-left" />
        ) : (
          <Icon type="triangle-right" />
        )}
      </NavItem>
    );
  };

  return (
    <nav
      className={classNames('NavBar', className, {
        'NavBar--trigger': showTrigger
      })}
    >
      <Scrim show={showDropdown} />
      <ul>
        {showPrevious && navBarTriangle({ direction: 'previous' })}
        {showTrigger ? navItemComponentsWithTrigger : navItemComponents}
        {showNext && navBarTriangle({ direction: 'next' })}
      </ul>
    </nav>
  );
};

NavBar.displayName = 'NavBar';
NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  navTriggerChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default NavBar;
