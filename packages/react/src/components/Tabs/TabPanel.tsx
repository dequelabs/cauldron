import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useId } from 'react-id-generator';

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  panelref: React.RefObject<HTMLDivElement>;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const TabPanel = ({
  children,
  id: propId,
  panelref,
  className,
  ...other
}: TabPanelProps) => {
  const [id] = propId ? [propId] : useId(1, 'tabpanel');
  return (
    <div
      role="tabpanel"
      className={classNames('TabPanel', className)}
      id={id}
      ref={panelref}
      {...other}
    >
      {children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';
TabPanel.Proptypes = {
  panelref: PropTypes.instanceOf(HTMLDivElement).isRequired,
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

export default TabPanel;
