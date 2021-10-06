import React from 'react';
import PropTypes from 'prop-types';
import { useId } from 'react-id-generator';

interface TabProps extends React.HTMLAttributes<HTMLLIElement> {
  id?: string;
  targetref: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, id: propId, ...other }: TabProps, ref) => {
    return (
      <li id={propId} ref={ref} role="tab" {...other}>
        {children}
      </li>
    );
  }
);

Tab.displayName = 'Tab';
Tab.propTypes = {
  children: PropTypes.node
};

export default Tab;
