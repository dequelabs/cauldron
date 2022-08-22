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
import { useDarkMode } from '../hooks/useDarkMode';
import styles from '../styles/TopbarLayout.module.css';
import classNames from 'classnames';
import Image from 'next/image';

const TopbarLayout = () => {
  const [thin, setThin] = useState(false);
  const [show, setShow] = useState(false);
  const topBarTrigger = createRef<HTMLButtonElement>();
  const { isDarkMode, toggle } = useDarkMode();

  // const onSettingsSelect = (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   e.preventDefault();

  //   if (e.currentTarget === 'theme') {
  //     localStorage.setItem(
  //       CAULDRON_THEME_STORAGE_KEY,
  //       ternaryDarkMode === 'light' ? 'Light' : 'Dark'
  //     );
  //     //toggleTheme();
  //   } else {
  //     setThin(!thin);
  //   }
  // };

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
              <Image
                src={isDarkMode ? '/logo-dark.png' : '/logo-light.png'}
                alt="Dark"
                width={40}
                height={40}
                layout="intrinsic"
              />
              <Image
                src={isDarkMode ? '/logo.svg' : '/dark-logo.svg'}
                width="48"
                height="48"
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
          <OptionsMenuList>
            <li>Default top bar</li>
            <li>Thin top bar</li>
            <li id="theme">
              <button type="button" onClick={toggle}>
                {isDarkMode ? 'dark' : 'light'} Theme
              </button>
            </li>
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
