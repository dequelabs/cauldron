import React from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';

interface AccordionProps {
  children?: React.ReactNode;
  className?: string;
}

const Accordion = ({ className, children }: AccordionProps) => {
  return (
    <div
      className={classNames(className ? className : '', 'Accordion__container')}
    >
      {children}
    </div>
  );
};

export default Accordion;
