import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from './Home';
import {
  TopBar,
  Workspace,
  TopBarTrigger,
  SideBar,
  SkipLink,
  MenuItem,
  OptionsMenuList,
  TopBarMenu
} from '../packages/react/src';

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
  state = { show: false };
  constructor() {
    super();
    this.onTriggerClick = this.onTriggerClick.bind(this);
  }

  onTriggerClick(e) {
    const { show } = this.state;

    if (e) {
      e.preventDefault();
    }

    if (show && this.topBarTrigger) {
      this.topBarTrigger.focus();
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

  toggleTopBarMenu = () => {
    this.setState(({ showTopBarMenu }) => ({
      showTopBarMenu: !showTopBarMenu
    }));
  };

  componentDidMount() {
    document.addEventListener('topbarmenutoggle', this.toggleTopBarMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('topbarmenutoggle', this.toggleTopBarMenu);
  }

  renderSideBarLink(pathname, text) {
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
        tabIndex={-1}
      >
        {text}
      </Link>
    );
  }

  render() {
    const { showTopBarMenu } = this.state;

    /* eslint-disable jsx-a11y/anchor-has-content */
    return (
      <Router>
        <div>
          <Helmet
            titleTemplate="%s | Deque Cauldron React"
            defaultTitle="Deque Cauldron React"
          />
          <SkipLink target={'#main-content'} />
          <TopBar hasTrigger={true}>
            <TopBarTrigger
              onClick={this.onTriggerClick}
              menuItemRef={el => (this.topBarTrigger = el)}
            />
            <MenuItem>
              <Link tabIndex={-1} to="/">
                Cauldron
              </Link>
            </MenuItem>

            {/* The below line demonstrates the ability to conditionally include menu item children. */}
            {false && <MenuItem>Potato</MenuItem>}

            {showTopBarMenu && (
              <TopBarMenu id="topbar-menu" className="dqpl-right-aligned">
                {`I'm a menu thingy`}
                <OptionsMenuList>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </OptionsMenuList>
              </TopBarMenu>
            )}

            <MenuItem className={showTopBarMenu ? '' : 'dqpl-right-aligned'}>
              <a
                tabIndex={-1}
                href="https://github.com/dequelabs/cauldron-react"
                className="fa fa-github"
                aria-label="Cauldron React on GitHub"
              />
            </MenuItem>
          </TopBar>
          <SideBar show={this.state.show} onDismiss={this.onTriggerClick}>
            {componentsList.map(name => (
              <MenuItem key={name}>
                {this.renderSideBarLink(`/components/${name}`, name)}
              </MenuItem>
            ))}
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
