import React, { useRef, Fragment, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import focusable from 'focusable';
import mdxComponents from './mdx-components';
import Footer from './components/Footer';
import ComponentLayout from './components/ComponentLayout';
import Drawer from './components/Drawer';
import Navigation from './components/Navigation';
import {
  Code,
  TopBar,
  MenuBar,
  TopBarTrigger,
  TopBarItem,
  Workspace,
  SideBar,
  SideBarItem,
  SkipLink,
  OptionsMenuList,
  TopBarMenu,
  Icon,
  ThemeProvider
} from '@deque/cauldron-react';
import { components, pages, componentsV2, componentsV1 } from './collections';
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
  const navigationRef = useRef(null);
  const topBarTrigger = useRef();
  const [workspaceTabIndex, setWorkspaceTabIndex] = useState(-1);
  const { theme, toggleTheme } = useThemeContext();

  const focusTopBarMenuItem = () => {
    if (!topBarMenuItem) {
      return;
    }

    topBarMenuItem?.focus();
  };

  const onTriggerClick = e => {
    const { show } = state;

    if (e) {
      e.preventDefault();
    }

    if (show && topBarTrigger?.current) {
      topBarTrigger?.current?.focus();
    }

    setState({ show: !show });
  };

  const onSettingsSelect = e => {
    if (e.target.id === 'theme') {
      localStorage.setItem(
        CAULDRON_THEME_STORAGE_KEY,
        theme === 'light' ? 'dark' : 'light'
      );
      toggleTheme();
    } else {
      setState({
        thin: e.target.innerText === 'Thin top bar'
      });
    }
  };

  const handleTitleChange = location => {
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

  useEffect(() => {
    document.addEventListener('focusTopBarMenu', focusTopBarMenuItem);

    return () => {
      document.removeEventListener('focusTopBarMenu', focusTopBarMenuItem);
    };
  }, []);

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
    if (state.show) {
      // Focus on the first focusable navigation item
      navigationRef.current?.querySelector('a')?.focus();
    } else {
      workspaceRef.current?.focus();
    }
  }, [state.show]);

  useEffect(() => {
    const firstFocusableElement = workspaceRef.current?.querySelector(
      focusable
    );
    setWorkspaceTabIndex(!firstFocusableElement ? 0 : -1);
  });

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

          {/* The below line demonstrates the ability to conditionally include menu item children. */}
          {false && <TopBarItem>Potato</TopBarItem>}

          <TopBarMenu
            id="topbar-menu"
            className="MenuItem--align-right MenuItem--separator MenuItem--arrow-down"
            menuItemRef={el => setTopBarMenuItem}
          >
            <div className="TopBar__item--icon">
              {thin ? (
                <Icon type="gears" label="Settings" />
              ) : (
                <Fragment>
                  <Icon type="gears" />
                  <div>Settings</div>
                </Fragment>
              )}
            </div>
            <OptionsMenuList onSelect={onSettingsSelect}>
              <li>Default top bar</li>
              <li>Thin top bar</li>
              <li id="theme">{theme === 'dark' ? 'Light' : 'Dark'} Theme</li>
            </OptionsMenuList>
          </TopBarMenu>
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
          active={drawerIsActive}
          open={show}
          onClose={() => setState({ show: false })}
        >
          <Navigation
            id="navigation"
            active={show || !drawerIsActive}
            ref={navigationRef}
            contentRef={workspaceRef}
            onClick={() => setState({ show: false })}
            aria-hidden={!show && drawerIsActive}
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
            let render = Component;

            // Special case for MDX components, since we want to wrap them with
            // a specific layout/provider
            if (componentsV2.find(c => c.name === name)) {
              render = () => (
                <ComponentLayout {...props}>
                  <Component components={mdxComponents} />
                </ComponentLayout>
              );
            }

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

render(
  <ThemeProvider initialTheme={initialTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
