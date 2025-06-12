import React from 'react';

interface TabProps extends React.HTMLAttributes<HTMLLIElement> {
  target: React.RefObject<HTMLDivElement> | HTMLElement;
  id?: string;
  children?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, id: propId, target, ...other }: TabProps, ref) => {
    return (
      <li id={propId} ref={ref} {...other}>
        {children}
      </li>
    );
  }
);

Tab.displayName = 'Tab';

export default Tab;
