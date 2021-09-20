import React from 'react';

interface TabPanelsProps {
  children: React.ReactNode;
  className: string;
}

const TabPanels = (props: TabPanelsProps) => {
  const { children } = props;
  return <div>{children}</div>;
};

export default TabPanels;
