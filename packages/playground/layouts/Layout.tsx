import { ReactNode } from 'react';
import SidebarLayout from './SidebarLayout';
import TopbarLayout from './TopbarLayout';
import Footer from './Footer';
import { Workspace } from '@deque/cauldron-react';

type LayoutProps = {
  children: ReactNode | ReactNode[];
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <TopbarLayout />
      <SidebarLayout />
      <Workspace>{children}</Workspace>
      <Footer>Test</Footer>
    </>
  );
};

Layout.displayName = 'Layout';
export default Layout;
