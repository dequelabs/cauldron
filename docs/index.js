import React, { useRef, Fragment, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import Home from './Home';
import {
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
import logo from './assets/img/logo.svg';
import 'fontsource-roboto';
import 'fontsource-lato';

// styles
import '../packages/styles';
import '@deque/cauldron-react/cauldron.css';
import './index.css';
import { useThemeContext } from '../packages/react/lib';

const componentsList = [
  'Button',
  'Pointout',
  'Alert',
  'Modal',
  'TopBarMenu',
  'Toast',
  'Loader',
  'Layout',
  'OptionsMenu',
  'Select',
  'RadioGroup',
  'Checkbox',
  'ClickOutsideListener',
  'Tooltip',
  'TooltipTabstop',
  'Card',
  'ExpandCollapsePanel',
  'TextField',
  'Link',
  'Icon',
  'IconButton',
  'Code',
  'LoaderOverlay',
  'Line',
  'Tag',
  'Table',
  'DescriptionList',
  'TopBar',
  'Stepper'
].sort();

const App = () => {
  const [state, setState] = useState({
    show: false,
    thin: false,
    variant: 'dark'
  });
  const [topBarMenuItem, setTopBarMenuItem] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const topBarTrigger = useRef();
  const { theme, toggleTheme } = useThemeContext();

  const toggleTopBarVariant = e => {
    const nextTheme = state.variant === 'dark' ? 'light' : 'dark';
    setState({ variant: nextTheme });
  };

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
          state: { title: `${text} | Component demo` }
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

  useEffect(() => {
    document.addEventListener('focusTopBarMenu', focusTopBarMenuItem);
    document.addEventListener('toggleTopBarVariant', toggleTopBarVariant);

    return () => {
      document.removeEventListener('focusTopBarMenu', focusTopBarMenuItem);
      document.removeEventListener('toggleTopBarVariant', toggleTopBarVariant);
    };
  }, []);

  const { show, thin } = state;

  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <Router>
      <div>
        <Helmet
          titleTemplate="%s | Deque Cauldron React"
          defaultTitle="Deque Cauldron React"
        />
        <SkipLink target={'#main-content'} />
        <TopBar variant={state.variant}>
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
                <img src={logo} alt="" /> <span>Cauldron</span>
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
        <SideBar show={state.show} onDismiss={onTriggerClick}>
          {componentsList.map(name => {
            const pathname = `/components/${name}`;
            const isActive = pathname === location.pathname;
            return (
              <SideBarItem
                key={name}
                className={classNames({
                  'MenuItem--active': isActive
                })}
              >
                {renderSideBarLink(pathname, name, isActive)}
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
          {componentsList.map(name => {
            const DemoComponent = require(`./patterns/components/${name}`)
              .default;
            return (
              <Route
                key={name}
                exact
                path={`/components/${name}`}
                component={DemoComponent}
              />
            );
          })}
          <Route
            component={({ location }) =>
              location.state && location.state.title ? (
                <Helmet title={location.state.title} />
              ) : null
            }
          />
        </Workspace>
      </div>
    </Router>
  );
  /* eslint-enable jsx-a11y/anchor-has-content */
};

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
