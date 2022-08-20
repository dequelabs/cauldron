import { ReactNode } from 'react'
import SidebarLayout from './SidebarLayout'
import TopbarLayout from './TopbarLayout'
import Footer from './Footer'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <TopbarLayout />
      <SidebarLayout />
      {children}
      <Footer>Test</Footer>
    </>
  )
}

Layout.displayName = 'Layout'
export default Layout
