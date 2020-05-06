import React, { Component, createRef, Fragment } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import classNames from 'classnames';
import Home from './Home';
import {
  TopBar,
  TopBarTrigger,
  TopBarItem,
  Workspace,
  SideBar,
  SideBarItem,
  SkipLink,
  OptionsMenuList,
  TopBarMenu,
  Icon
} from '../packages/react/src';
import logo from './assets/img/logo.svg';

// styles
import '../packages/styles';
import '../packages/react/src/index.css';
import './index.css';

const componentsList = [
  'Button',
  'FirstTimePointOut',
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
  'Card',
  'ExpandCollapsePanel',
  'TextField',
  'Link'
].sort();

class App extends Component {
  state = { show: false, thin: false };
  constructor() {
    super();
    this.onTriggerClick = this.onTriggerClick.bind(this);
    this.topBarTrigger = createRef();
  }

  componentDidMount() {
    document.addEventListener('focusTopBarMenu', this.focusTopBarMenuItem);
  }

  componentWillUnmount() {
    document.removeEventListener('focusTopBarMenu', this.focusTopBarMenuItem);
  }

  focusTopBarMenuItem = () => {
    if (!this.topBarMenuItem) {
      return;
    }

    this.topBarMenuItem.focus();
  };

  onTriggerClick(e) {
    const { show } = this.state;

    if (e) {
      e.preventDefault();
    }

    if (show && this.topBarTrigger.current) {
      this.topBarTrigger.current.focus();
    }

    this.setState({ show: !show });
  }

  toggleMenu = () => {
    this.setState(({ menuOpen }) => ({
      menuOpen: !menuOpen
    }));
  };

  handleClose = () => {
    this.setState({ menuOpen: false });
  };

  onSettingsSelect = e => {
    this.setState({
      thin: e.target.innerText === 'Thin top bar'
    });
  };

  renderSideBarLink(pathname, text, isCurrent) {
    return (
      <Link
        to={{
          pathname,
          state: { title: `${text} | Component demo` }
        }}
        onClick={() => {
          this.setState({ show: false });
          this.workspace.focus();
        }}
        aria-current={isCurrent ? 'page' : null}
      >
        {text}
      </Link>
    );
  }

  render() {
    const { show, thin } = this.state;

    /* eslint-disable jsx-a11y/anchor-has-content */
    return (
      <Router>
        <div>
          <Helmet
            titleTemplate="%s | Deque Cauldron React"
            defaultTitle="Deque Cauldron React"
          />
          <SkipLink target={'#main-content'} />
          <TopBar thin={thin} hasTrigger>
            <TopBarTrigger onClick={this.onTriggerClick}>
              <button
                tabIndex={-1}
                aria-label="Menu"
                aria-haspopup="true"
                ref={this.topBarTrigger}
                aria-expanded={show}
              >
                <Icon type="fa-bars" />
              </button>
            </TopBarTrigger>
            <TopBarItem>
              <Link to="/" className="dqpl-logo-item" tabIndex={-1}>
                <img src={logo} alt="" /> <span>Cauldron</span>
              </Link>
            </TopBarItem>

            {/* The below line demonstrates the ability to conditionally include menu item children. */}
            {false && <TopBarItem>Potato</TopBarItem>}

            <TopBarMenu
              id="topbar-menu"
              className="dqpl-right-aligned dqpl-separator dropdown-arrow-down"
              menuItemRef={el => (this.topBarMenuItem = el)}
            >
              <div className="dqpl-top-bar-icon-item">
                {thin ? (
                  <Icon type="fa-cog" label="Settings" />
                ) : (
                  <Fragment>
                    <Icon type="fa-cog" />
                    <div>Settings</div>
                  </Fragment>
                )}
              </div>
              <OptionsMenuList onSelect={this.onSettingsSelect}>
                <li>Default top bar</li>
                <li>Thin top bar</li>
              </OptionsMenuList>
            </TopBarMenu>

            <TopBarItem className="dqpl-separator">
              <a
                href="https://github.com/dequelabs/cauldron-react"
                className="fa fa-github"
                aria-label="Cauldron React on GitHub"
                tabIndex={-1}
              />
            </TopBarItem>
          </TopBar>
          <SideBar show={this.state.show} onDismiss={this.onTriggerClick}>
            {componentsList.map(name => {
              const pathname = `/components/${name}`;
              const isActive = pathname === location.pathname;
              return (
                <SideBarItem
                  key={name}
                  className={classNames({
                    'dqpl-menuitem-selected': isActive
                  })}
                >
                  {this.renderSideBarLink(pathname, name, isActive)}
                </SideBarItem>
              );
            })}
          </SideBar>
          <Workspace
            id="main-content"
            workspaceRef={el => (this.workspace = el)}
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
  }
}

render(<App />, document.getElementById('root'));
