import { ReactNode, useEffect, useState } from 'react';
import SidebarLayout from './SidebarLayout';
import TopbarLayout from './TopbarLayout';
import Footer from './Footer';
import { Workspace } from '@deque/cauldron-react';
import styles from '../styles/Layout.module.css';
import { ThemeProvider } from '../../react/lib';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const [show, setShow] = useState(false);

  return (
    <ThemeProvider initialTheme="light">
      <TopbarLayout />
      <SidebarLayout show={show} />
      <Workspace className={styles.main}>{children}</Workspace>
      <Footer>Test</Footer>
    </ThemeProvider>
  );
};

Layout.displayName = 'Layout';
export default Layout;
