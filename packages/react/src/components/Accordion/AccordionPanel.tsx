import React, { useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';

type AccordionPanelProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const AccordionPanel = ({ children, className }: AccordionPanelProps) => {
  const [open, setOpen] = useState(false);
  function toggle() {
    setOpen(!open);
  }

  return (
    <ExpandCollapsePanel
      open={open}
      onToggle={() => setOpen(!open)}
      className="Accordion__panel"
    >
      {children}
    </ExpandCollapsePanel>
  );
};

export default AccordionPanel;
