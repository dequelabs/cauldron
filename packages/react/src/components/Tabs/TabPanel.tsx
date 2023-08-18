import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
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
        role="tabpanel"
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
TabPanel.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

export default TabPanel;
