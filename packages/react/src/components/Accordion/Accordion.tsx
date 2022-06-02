import React, { useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';

interface AccordionProps {
  children?: string;
  className?: string;
}

const Accordion = ({ className, children }: AccordionProps) => {
  return <div className="Accordion__container">{children}</div>;
};

export default Accordion;
