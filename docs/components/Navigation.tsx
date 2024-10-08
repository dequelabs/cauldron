import React, { useState, useEffect } from 'react';
import { Icon, Scrim } from '@deque/cauldron-react';
import { Link, useLocation } from 'react-router-dom';
import { components, pages, foundations } from '../collections';
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

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  contentRef: React.RefObject<HTMLElement>;
  onNavigation?: () => void;
}

function Navigation(
  { contentRef, onNavigation = () => {}, ...props }: NavigationProps,
  ref: React.Ref<HTMLElement>
) {
  const location = useLocation();

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

    onNavigation();
  };

  const activeComponents = components.filter(
    (component) => !component.deprecated
  );
  const deprecatedComponents = components.filter(
    (component) => component.deprecated
  );

  const renderListItem = ({ path, name }: (typeof components)[number]) => {
    const isActive = path === location.pathname;
    return (
      <li key={path}>
        <NavigationLink
          pathname={path}
          text={name}
          active={isActive}
          onClick={handleClick}
        />
      </li>
    );
  };

  return (
    <nav
      ref={ref}
      className="Navigation"
      aria-label="Site Navigation"
      {...props}
    >
      <h2>
        <Icon type="info-circle" /> Getting Started
      </h2>
      <ul>{pages.map(renderListItem)}</ul>
      <h2>
        <Icon type="info-circle" /> Foundations
      </h2>
      <ul>{foundations.map(renderListItem)}</ul>
      <h2>
        <Icon type="gears" />
        Components
      </h2>
      <ul>{activeComponents.map(renderListItem)}</ul>
      {!!deprecatedComponents.length && (
        <>
          <h2>
            <Icon type="caution" />
            Deprecated
          </h2>
          <ul>{deprecatedComponents.map(renderListItem)}</ul>
        </>
      )}
    </nav>
  );
}

export default React.forwardRef(Navigation);
