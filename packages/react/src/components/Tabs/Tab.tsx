import React from 'react';
import PropTypes from 'prop-types';

interface TabProps extends React.HTMLAttributes<HTMLLIElement> {
  target: React.RefObject<HTMLDivElement> | HTMLElement;
  id?: string;
  children?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, id: propId, target, ...other }: TabProps, ref) => {
    return (
      <li id={propId} ref={ref} role="tab" {...other}>
        {children}
      </li>
    );
  }
);

Tab.displayName = 'Tab';
Tab.propTypes = {
  target: PropTypes.any.isRequired,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default Tab;
