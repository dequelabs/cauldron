import {
  TopBar,
  MenuBar,
  TopBarTrigger,
  Icon,
  TopBarItem,
  TopBarMenu,
  OptionsMenuList
} from '@deque/cauldron-react';
import { createRef, Fragment, useState } from 'react';
import Link from 'next/link';
import { useThemeContext } from '../../react/lib/';
import styles from '../styles/TopbarLayout.module.css';
import classNames from 'classnames';

const CAULDRON_THEME_STORAGE_KEY = 'cauldron-theme';

const TopbarLayout = () => {
  const [thin, setThin] = useState(false);
  const [show, setShow] = useState(false);
  const topBarTrigger = createRef<HTMLButtonElement>();
  //const { theme, toggleTheme } = useThemeContext();
  let theme = 'dark';
  const onSettingsSelect = (
    e: React.MouseEvent<HTMLButtonElement | HTMLElement>
  ) => {
    console.log(e);
    console.log(e.currentTarget);
    if (e.target.id === 'theme') {
      localStorage.setItem(
        CAULDRON_THEME_STORAGE_KEY,
        theme === 'light' ? 'dark' : 'light'
      );
      //toggleTheme();
    } else {
      setThin(!thin);
    }
  };

  const onTriggerClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLElement>
  ) => {
    if (e) {
      e.preventDefault();
    }

    if (show && topBarTrigger?.current) {
      topBarTrigger?.current?.focus();
    }

    setShow(!show);
  };

  return (
    <TopBar role="banner" className={styles.topbar}>
      <MenuBar thin={thin} hasTrigger>
        <TopBarTrigger onClick={onTriggerClick}>
          <button
            tabIndex={-1}
            aria-label="Menu"
            aria-haspopup="true"
            ref={topBarTrigger}
            aria-expanded={false}
          >
            <Icon type="hamburger-menu" />
          </button>
        </TopBarTrigger>
        <TopBarItem>
          <Link href="/">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a className={classNames('MenuItem__logo')} tabIndex={-1}>
              <img
                src={theme === 'light' ? 'logo.svg' : 'dark-logo.svg'}
                alt=""
              />
              <span>Cauldron</span>
            </a>
          </Link>
        </TopBarItem>

        {/* The below line demonstrates the ability to conditionally include menu item children. */}
        {false && <TopBarItem>Potato</TopBarItem>}

        <TopBarMenu
          id="topbar-menu"
          className="MenuItem--align-right MenuItem--separator MenuItem--arrow-down"
          // menuItemRef={el => setTopBarMenuItem}
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
          <Link
            href="https://github.com/dequelabs/cauldron"
            className="fa fa-github"
            aria-label="Cauldron on GitHub"
            tabIndex={-1}
          >
            Cauldron on Github
          </Link>
        </TopBarItem>
      </MenuBar>
    </TopBar>
  );
};

export default TopbarLayout;
