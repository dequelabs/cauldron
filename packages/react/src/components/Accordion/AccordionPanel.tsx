import React, { useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';

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
    </ExpandCollapsePanel>
  );
};
