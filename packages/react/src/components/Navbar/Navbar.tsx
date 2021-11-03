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
  direction: 'left' | 'right';
}

const NavBar = ({
  children,
  initialActiveIndex = 0,
  className,
  navTriggerChildren = 'MAIN MENU',
  limit = null
}: NavBarProps) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [showTrigger, setShowTrigger] = useState(isNarrow());
  const [showDropdown, setShowDropdown] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showLeftTriangle, setShowLeftTriangle] = useState(false);
  const [showRightTriangle, setShowRightTriangle] = useState(false);

  const navItems = React.Children.toArray(children).filter(child => {
    return (child as React.ReactElement<any>).type === NavItem;
  });

  const navItemCount = navItems.length;
  console.log({
    offset,
    limit,
    navItemCount,
    showRightTriangle,
    showLeftTriangle
  });

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
      setShowLeftTriangle(false);
      setShowRightTriangle(false);
      return;
    }
    // no pagination when no limit
    if (!limit) {
      setShowLeftTriangle(false);
      setShowRightTriangle(false);
      return;
    }
    // no pagination when item count is smaller than limit
    if (navItemCount <= limit) {
      setShowLeftTriangle(false);
      setShowRightTriangle(false);
      return;
    }
    // show right triangle when offset plus item limit does not reach item count
    if (offset + limit < navItemCount) {
      setShowRightTriangle(true);
    }

    // show left triangle when offset is bigger than 0
    if (offset > 0) {
      setShowLeftTriangle(true);
    }
  }, [limit, offset, showTrigger]);

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  const navItemComponents = navItems
    .filter((child, index) => {
      if (limit) {
        const nextOffset = offset + limit;
        return index >= offset && index < nextOffset;
      }
      return child;
    })
    .map((child, index) => {
      const { show = true, ...other } = (child as React.ReactElement<
        any
      >).props;

      const config = {
        className: classNames('NavItem', {
          'NavItem--hidden': !show,
          'NavItem--active': index === activeIndex
        }),
        onClick: () => handleClick(index),
        ...other
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

      direction === 'left'
        ? setOffset(offset - limit)
        : setOffset(offset + limit);
    };

    return (
      <NavItem onClick={handleTriangleClick}>
        {direction === 'left' ? (
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
        {showLeftTriangle && navBarTriangle({ direction: 'left' })}
        {showTrigger ? navItemComponentsWithTrigger : navItemComponents}
        {showRightTriangle && navBarTriangle({ direction: 'right' })}
      </ul>
    </nav>
  );
};

NavBar.displayName = 'Navbar';
NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  navTriggerChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default NavBar;
