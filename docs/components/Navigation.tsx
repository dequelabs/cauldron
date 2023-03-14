import React, { useState, useEffect } from 'react';
import { Icon, ClickOutsideListener, Scrim } from '@deque/cauldron-react';
import { Link, useLocation } from 'react-router-dom';
import { components, pages } from '../collections';
import './Navigation.css';

interface NavigationLinkProps {
  pathname: string;
  text: string;
  onClick: () => void;
  active?: boolean;
  tabIndex?: number;
}

const NavigationLink = ({
  pathname,
  text,
  onClick,
  tabIndex,
  active = false
}: NavigationLinkProps) => (
  <Link
    className="Link"
    to={{
      pathname,
      state: {
        title: `${text} | Accessible Component Pattern Demo`,
        description: `Free Accessible React ${text} Component Pattern from Deque Systems`
      }
    }}
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    tabIndex={tabIndex}
  >
    {text}
  </Link>
);

interface NavigationProps {
  contentRef: React.RefObject<HTMLElement>;
  show?: boolean;
  onClick?: () => void;
}

export default function Navigation({
  contentRef,
  show,
  onClick = () => {}
}: NavigationProps) {
  const location = useLocation();
  const [isHamburger, setIsHamburger] = useState(false);

  const handleClick = () => {
    if (contentRef.current) {
      contentRef.current.focus();
      let target: HTMLElement | null = contentRef.current;
      // Ensure target node and any ancestor elements reset scroll position
      while (target) {
        target.scrollTop = 0;
        target = target.parentElement;
      }
    }

    onClick();
  };

  const handleClickOutside = () => {
    if (!show) {
      return;
    }

    onClick();
  };

  useEffect(() => {
    const mediaQueryList = matchMedia('(max-width: 64rem)');
    const listener = ({ matches }: { matches: boolean }) => {
      setIsHamburger(matches);
    };
    mediaQueryList.addEventListener('change', listener);

    if (mediaQueryList.matches !== isHamburger) {
      setIsHamburger(mediaQueryList.matches);
    }

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, []);

  return (
    <>
      <ClickOutsideListener onClickOutside={handleClickOutside}>
        <nav
          className="Navigation"
          aria-label="Site Navigation"
          aria-hidden={!show && isHamburger}
        >
          <h2>
            <Icon type="info-circle" /> Getting Started
          </h2>
          <ul>
            {pages.map(({ path, name }) => {
              const isActive = path === location.pathname;
              return (
                <li key={path}>
                  <NavigationLink
                    pathname={path}
                    text={name}
                    active={isActive}
                    onClick={handleClick}
                    tabIndex={show ? undefined : -1}
                  />
                </li>
              );
            })}
          </ul>
          <h2>
            <Icon type="gears" />
            Components
          </h2>
          <ul>
            {components.map(({ path, name }) => {
              const isActive = path === location.pathname;
              return (
                <li key={path}>
                  <NavigationLink
                    pathname={path}
                    text={name}
                    active={isActive}
                    onClick={handleClick}
                    tabIndex={show ? undefined : -1}
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </ClickOutsideListener>
      {isHamburger && <Scrim show={show} />}
    </>
  );
}
