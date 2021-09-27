import React from 'react';
import PropTypes from 'prop-types';

interface TabProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, ...other }: TabProps, ref) => (
    <li ref={ref} role="tab" {...other}>
      {children}
    </li>
  )
);

Tab.displayName = 'Tab';
Tab.propTypes = {
  children: PropTypes.node
};

export default Tab;
