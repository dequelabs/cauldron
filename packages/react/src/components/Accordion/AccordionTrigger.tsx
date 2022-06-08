import React, { forwardRef, useRef, useState } from 'react';
import classNames from 'classnames';
import { PanelTrigger } from '../ExpandCollapsePanel';

type AccordionTriggerProps = {
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
};

const AccordionTrigger = ({ className, children }: AccordionTriggerProps) => {
  return (
    <PanelTrigger
      className={classNames(className ? className : 'Accordion__trigger')}
    >
      <span>{children}</span>
    </PanelTrigger>
  );
};
AccordionTrigger.displayName = 'AccordionTrigger';

export default AccordionTrigger;
