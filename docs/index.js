import React, { useRef, Fragment, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import mdxComponents from './mdx-components';
import Footer from './components/Footer';
import ComponentLayout from './components/ComponentLayout';
import Navigation from './components/Navigation';
import {
  Drawer as DrawerComponent,
  TopBar,
  MenuBar,
  TopBarTrigger,
  TopBarItem,
  Workspace,
  SkipLink,
  ActionMenu,
  ActionList,
  ActionListGroup,
  ActionListItem,
  TopBarMenu,
  Icon,
  ThemeProvider
} from '@deque/cauldron-react';
import { components, foundations, pages } from './collections';
import logo from './assets/img/logo.svg';
import darkLogo from './assets/img/dark-logo.svg';
import '@fontsource/roboto';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';
import '@fontsource/lato';
import '@fontsource/pt-mono';

// styles
import '../packages/styles';
import '@deque/cauldron-react/cauldron.css';
import './index.css';
import { useThemeContext } from '../packages/react/lib';

const CAULDRON_THEME_STORAGE_KEY = 'cauldron_theme';

const App = () => {
  const [state, setState] = useState({
    show: false,
    thin: false
  });
  const [topBarMenuItem, setTopBarMenuItem] = useState(null);
  const workspaceRef = useRef(null);
  const focusReturnRef = useRef(null);
  const navigationRef = useRef(null);
  const actionMenuItemRef = useRef(null);
  const actionMenuRef = useRef(null);
  const topBarTrigger = useRef();
  const [workspaceTabIndex, setWorkspaceTabIndex] = useState(-1);
  const { theme, toggleTheme } = useThemeContext();

  const onTriggerClick = (e) => {
    const { show } = state;

    if (e) {
      e.preventDefault();
    }

    setState({ show: !show });
  };

  const handleThemeChange = (_theme) => () => {
    if (theme === _theme) {
      return;
    }

    localStorage.setItem(
      CAULDRON_THEME_STORAGE_KEY,
      theme === 'light' ? 'dark' : 'light'
    );
    toggleTheme();
  };

  const handleTitleChange = (location) => {
    let title = location.pathname.split('/').pop();

    location.state = {
      title: '',
      description: ''
    };

    const matchingComponent = components.find(({ name }) => name === title);

    if (matchingComponent?.title) {
      location.state.title = `${title} | Accessible Component Pattern Demo`;
      location.state.description = `Free Accessible React ${title} Component Pattern from Deque Systems`;
    } else {
      location.state.title = `Cauldron React: Accessible Components Library`;
      location.state.description = `Free Accessible React Components from Deque Systems`;
    }

    return (
      <Helmet title={location.state.title}>
        <meta name="description" content={location.state.description} />
      </Helmet>
    );
  };

  const { show, thin } = state;

  const [drawerIsActive, setDrawerIsActive] = useState(false);
  useEffect(() => {
    const mediaQueryList = matchMedia('(max-width: 64rem)');
    const listener = ({ matches }) => {
      setDrawerIsActive(matches);
    };
    mediaQueryList.addEventListener('change', listener);

    if (mediaQueryList.matches !== drawerIsActive) {
      setDrawerIsActive(mediaQueryList.matches);
    }

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, []);

  useEffect(() => {
    // ensure focus return always "resets" after a navigation
    focusReturnRef.current = null;
  });

  // Only render the collapse-able drawer component when there is space to do so
  const Drawer = drawerIsActive
    ? DrawerComponent
    : (props) => <Fragment>{props.children}</Fragment>;

  return (
    <Router>
      <Helmet
        titleTemplate="%s | Deque Systems"
        defaultTitle="Deque Cauldron React"
      />
      <SkipLink target={'#main-content'} aria-label="Skip" />
      <TopBar role="banner">
        <MenuBar thin={thin} hasTrigger>
          <TopBarTrigger onClick={onTriggerClick}>
            <button
              tabIndex={-1}
              aria-label="Menu"
              aria-haspopup="true"
              ref={topBarTrigger}
              aria-expanded={show}
              aria-controls="navigation"
            >
              <Icon type="hamburger-menu" />
            </button>
          </TopBarTrigger>
          <TopBarItem>
            <Link to="/" className="MenuItem__logo" tabIndex={-1}>
              <img src={theme === 'dark' ? logo : darkLogo} alt="Cauldron" />{' '}
              <span aria-hidden="true">Cauldron</span>
            </Link>
          </TopBarItem>
          <ActionMenu
            tabIndex={-1}
            trigger={({ ref, ...props }) => {
              return (
                <TopBarItem
                  menuItemRef={ref}
                  className="MenuItem--align-right MenuItem--separator MenuItem--arrow-down"
                  tabIndex={0}
                  {...props}
                >
                  <span className="TopBar__item--icon">
                    <Icon type="gears" />
                    <div>Settings</div>
                  </span>
                  <div ref={actionMenuRef} />
                </TopBarItem>
              );
            }}
            placement="bottom-end"
            portal={actionMenuRef}
          >
            <ActionList>
              <ActionListGroup label="Theme" selectionType="single">
                <ActionListItem
                  onAction={handleThemeChange('light')}
                  selected={theme === 'light'}
                >
                  Light
                </ActionListItem>
                <ActionListItem
                  onAction={handleThemeChange('dark')}
                  selected={theme === 'dark'}
                >
                  Dark
                </ActionListItem>
              </ActionListGroup>
            </ActionList>
          </ActionMenu>
          <TopBarItem className="MenuItem--separator">
            <a
              href="https://github.com/dequelabs/cauldron"
              className="fa fa-github"
              aria-label="Cauldron on GitHub"
              tabIndex={-1}
            />
          </TopBarItem>
        </MenuBar>
      </TopBar>
      <div className="Content">
        <Drawer
          className="NavigationDrawer"
          open={show}
          position="left"
          focusOptions={{
            initialFocus: navigationRef,
            returnFocus: focusReturnRef
          }}
          onClose={() => setState({ show: false })}
        >
          <Navigation
            id="navigation"
            ref={navigationRef}
            contentRef={workspaceRef}
            tabIndex={-1}
            onNavigation={() => {
              setState({ show: false });
              focusReturnRef.current = workspaceRef.current;
            }}
          />
        </Drawer>
        <Workspace
          id="main-content"
          workspaceRef={workspaceRef}
          tabIndex={workspaceTabIndex}
          aria-hidden={show}
          aria-labelledby="main-title"
        >
          {pages.map(({ name, path, Component, ...props }) => {
            const render = () => (
              <ComponentLayout {...props}>
                <Component components={mdxComponents} />
              </ComponentLayout>
            );

            return <Route key={name} exact path={path} component={render} />;
          })}
          {components.map(({ name, path, Component, ...props }) => {
            const render = () => (
              <ComponentLayout {...props}>
                <Component components={mdxComponents} />
              </ComponentLayout>
            );

            return <Route key={name} exact path={path} component={render} />;
          })}
          {foundations.map(({ name, path, Component, ...props }) => {
            const render = () => (
              <ComponentLayout {...props}>
                <Component components={mdxComponents} />
              </ComponentLayout>
            );

            return <Route key={name} exact path={path} component={render} />;
          })}
          <Route
            component={({ location }) =>
              location.state && location.state.title ? (
                <Helmet title={location.state.title}>
                  <meta
                    name="description"
                    content={location.state.description}
                  />
                </Helmet>
              ) : (
                handleTitleChange(location)
              )
            }
          />
        </Workspace>
        <Footer theme={theme} aria-hidden={show} />
      </div>
    </Router>
  );
};

const initialTheme =
  localStorage.getItem(CAULDRON_THEME_STORAGE_KEY) ||
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light');
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider initialTheme={initialTheme}>
    <App />
  </ThemeProvider>
);
