import {
  TopBar,
  MenuBar,
  TopBarTrigger,
  Icon,
  TopBarItem,
  TopBarMenu,
  OptionsMenuList
} from '@deque/cauldron-react'
import { createRef, Fragment, useState } from 'react'
import Link from 'next/link'

const TopbarLayout = () => {
  const [workspace, setWorkspace] = useState(null)
  const [thin, setThin] = useState(false)
  const [show, setShow] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const topBarTrigger = createRef<HTMLButtonElement>()

  const onTriggerClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLElement>
  ) => {
    if (e) {
      e.preventDefault()
    }

    if (show && topBarTrigger?.current) {
      topBarTrigger?.current?.focus()
    }

    setShow(!show)
  }

  return (
    <TopBar role="banner">
      <MenuBar hasTrigger>
        <TopBarTrigger onClick={() => console.log('trigger clicked')}>
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
          <Link href="/" className="MenuItem__logo" tabIndex={-1}>
            <span>Cauldron</span>
            {/* <img src={theme === 'dark' ? logo : darkLogo} alt="" />{' '} */}
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
          <OptionsMenuList onSelect={onTriggerClick}>
            <li>Default top bar</li>
            <li>Thin top bar</li>
            <li id="theme">{/* theme === 'dark' ? 'Light' : 'Dark'*/} Theme</li>
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
  )
}

export default TopbarLayout
