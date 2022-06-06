import React, { useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';
import Accordion from './Accordion';
import {
  injectStyleTag,
  setStyle,
  removeStyleTag
} from '../../utils/stylesheets';

// interface AccordionProps {
//   children?: string;
//   className?: string;
// }

// const Accordion = ({ className, children }: AccordionProps) => {
//   return <div className="Accordion__container">{children}</div>;
// };

type AccordionItemProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const AccordionItem = ({ children, className }: AccordionItemProps) => {
  const [open, setOpen] = useState(false);
  function onToggle() {
    setOpen(!open);
  }

  return (
    <ExpandCollapsePanel
      open={open}
      onToggle={() => setOpen(!open)}
      className="Accordion__item"
    >
      <PanelTrigger className="Accordion__trigger">
        <span>Elements must have sufficient color contrast (14)</span>
      </PanelTrigger>
      {children}
    </ExpandCollapsePanel>
  );
};

type AccordionPanelProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  tabIndex?: number;
};

const AccordionPanel = ({ className, children }: AccordionPanelProps) => {
  return (
    <div
      className={classNames(className ? className : '', 'Accordion__panel')}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default Accordion;
export { Accordion, AccordionItem, AccordionPanel };
