import { ReactNode, useEffect, useState } from 'react';
import SidebarLayout from './SidebarLayout';
import TopbarLayout from './TopbarLayout';
import Footer from './Footer';
import { Workspace } from '@deque/cauldron-react';
import styles from '../styles/Layout.module.css';
import { useTernaryDarkMode } from '../hooks/useTernaryDarkMode';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const [show, setShow] = useState(false);

  const { isDarkMode } = useTernaryDarkMode();

  useEffect(() => {
    const nextElement = document.querySelector('.Layout');
    if (isDarkMode) {
      nextElement?.classList.add('cauldron--theme-dark');
      nextElement?.classList.remove('cauldron--theme-light');
    } else {
      nextElement?.classList.add('cauldron--theme-light');
      nextElement?.classList.remove('cauldron--theme-dark');
    }
    return;
  }, [isDarkMode]);

  return (
    <>
      <TopbarLayout />
      <SidebarLayout show={show} />
      <Workspace className={styles.main}>{children}</Workspace>
      <Footer>Test</Footer>
    </>
  );
};

Layout.displayName = 'Layout';
export default Layout;
