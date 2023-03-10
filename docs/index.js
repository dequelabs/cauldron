import React, { useRef, Fragment, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import { MDXProvider } from '@mdx-js/react';
import mdxComponents from './mdx-components';
import Home from './components/Home';
import Footer from './components/Footer';
import Example from './components/Example';
import ComponentLayout from './components/ComponentLayout';
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
import minimatch from 'minimatch';
import logo from './assets/img/logo.svg';
import darkLogo from './assets/img/dark-logo.svg';
import '@fontsource/roboto';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';
import '@fontsource/lato';
import '@fontsource/pt-mono';

// Collections
const collections = require
  .context('./', true, /\.(mdx|jsx?)$/)
  .keys()
  .reduce(
    (collections, key) => {
      const pagesMatch = minimatch(key, './pages/*.mdx');
      const componentMatch = minimatch(key, './pages/components/*.mdx');
      const componentsV1Match = minimatch(key, './patterns/components/**/*.js');

      if (pagesMatch) {
        const name = key.match(/(\w+)\.mdx$/)[1];
        const {
          default: Component,
          title,
          path
        } = require(`./pages/${name}.mdx`);
        const component = { name, title, Component, path: path || `/${name}` };
        collections.pages.push(component);
      } else if (componentMatch) {
        const name = key.match(/(\w+)\.mdx$/)[1];
        const {
          default: Component,
          title,
          path,
          ...props
        } = require(`./pages/components/${name}.mdx`);
        const component = {
          name,
          title,
          Component,
          path: path || `/components/${name}`,
          ...props
        };
        collections.components.push(component);
      } else if (componentsV1Match) {
        const name = key.match(/(\w+)\/index\.jsx?$/)[1];
        const { default: Component } = require(`./patterns/components/${name}`);
        const component = {
          name,
          title: name,
          Component,
          path: `/components/${name}`
        };
        collections.componentsV1.push(component);
      }

      return collections;
    },
    { pages: [], components: [], componentsV1: [] }
  );

// Merge V1/MDX components into a single list with MDX components taking priority
const componentsList = [
  ...collections.components,
  ...collections.componentsV1.filter(
    v1 => !collections.components.find(c => c.name === v1.name)
  )
].sort((a, b) => a.name.localeCompare(b.name));

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
  const [workspace, setWorkspace] = useState(null);
  const topBarTrigger = useRef();
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

  const toggleMenu = () => {
    setState(({ menuOpen }) => ({
      menuOpen: !menuOpen
    }));
  };

  const handleClose = () => {
    setState({ menuOpen: false });
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

  const renderSideBarLink = (pathname, text, isCurrent) => {
    return (
      <Link
        to={{
          pathname,
          state: {
            title: `${text} | Accessible Component Pattern Demo`,
            description: `Free Accessible React ${text} Component Pattern from Deque Systems`
          }
        }}
        onClick={() => {
          setState({ show: false });
          workspace?.focus();
        }}
        aria-current={isCurrent ? 'page' : null}
      >
        {text}
      </Link>
    );
  };

  const handleTitleChange = location => {
    let title = location.pathname.split('/').pop();

    location.state = {
      title: '',
      description: ''
    };

    const matchingComponent = componentsList.find(({ name }) => name === title);

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

  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <Router>
      <div>
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
        <SideBar
          show={state.show}
          onDismiss={onTriggerClick}
          className="SideBar--with-footer"
        >
          {componentsList.map(({ name, path }) => {
            const isActive = path === location.pathname;
            return (
              <SideBarItem
                key={name}
                className={classNames({
                  'MenuItem--active': isActive
                })}
              >
                {renderSideBarLink(path, name, isActive)}
              </SideBarItem>
            );
          })}
        </SideBar>
        <Workspace
          id="main-content"
          workspaceRef={el => setWorkspace}
          tabIndex={-1}
        >
          <Route exact path="/" component={Home} />
          {componentsList.map(({ name, path, Component, ...props }) => {
            let render = Component;

            if (Component.name === 'MDXContent') {
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
        <Footer theme={theme} />
      </div>
    </Router>
  );
  /* eslint-enable jsx-a11y/anchor-has-content */
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
