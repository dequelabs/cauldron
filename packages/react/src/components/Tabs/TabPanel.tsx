import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useId } from 'react-id-generator';

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, id: propId, className, ...other }: TabPanelProps, ref) => {
    const [id] = propId ? [propId] : useId(1, 'tabpanel');
    return (
      <div
        className={classNames('TabPanel', className)}
        id={id}
        ref={ref}
        {...other}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';

export default TabPanel;
