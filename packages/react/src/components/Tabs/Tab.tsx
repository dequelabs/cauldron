import React from 'react';
import PropTypes from 'prop-types';
import { useId } from 'react-id-generator';

interface TabProps extends React.HTMLAttributes<HTMLLIElement> {
  id?: string;
  target: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, id: propId, ...other }: TabProps, ref) => {
    const [id] = propId ? [propId] : useId(1, 'tab');
    console.log(other.target);
    return (
      <li id={id} ref={ref} role="tab" {...other}>
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
