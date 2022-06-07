import React, { useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';
import AccordionTrigger from './AccordionTrigger';

type AccordionPanelProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  //open: boolean;
};

const AccordionPanel = ({ children, className }: AccordionPanelProps) => {
  const [open, setOpen] = useState(true);
  function toggle() {
    console.log('clicked');
    setOpen(!open);
    //setOpen(!open);
  }

  return (
    <>
      <ExpandCollapsePanel
        open={open}
        onToggle={() => toggle()}
        className="Accordion__panel"
      >
        <AccordionTrigger open={open}></AccordionTrigger>
      </ExpandCollapsePanel>
    </>
  );
};

export default AccordionPanel;
