import { ReactNode } from 'react';
import SidebarLayout from './SidebarLayout';
import TopbarLayout from './TopbarLayout';
import Footer from './Footer';
import { ThemeProvider, Workspace } from '@deque/cauldron-react';
import styles from '../styles/Layout.module.css';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  if (!ThemeProvider) {
    return <></>;
  }

  return (
    <div>
      <ThemeProvider initialTheme="dark">
        <TopbarLayout />
        <SidebarLayout />
        <Workspace className={styles.main}>{children}</Workspace>
        <Footer>Test</Footer>
      </ThemeProvider>
    </div>
  );
};

Layout.displayName = 'Layout';
export default Layout;
