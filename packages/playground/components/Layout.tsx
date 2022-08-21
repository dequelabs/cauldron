import { ReactNode } from 'react';
import SidebarLayout from './SidebarLayout';
import TopbarLayout from './TopbarLayout';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <TopbarLayout />
      <SidebarLayout />
      {children}
      <Footer>Test</Footer>
    </div>
  );
};

Layout.displayName = 'Layout';
export default Layout;
