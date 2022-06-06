import React, { useState } from 'react';
import classNames from 'classnames';
import { PanelTrigger } from '../ExpandCollapsePanel';

type AccordionTriggerProps = {
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const AccordionTrigger = ({
  className,
  children,
  onClick
}: AccordionTriggerProps) => {
  return (
    <PanelTrigger
      className={classNames(className ? className : 'Accordion__trigger')}
    >
      <span>{children}</span>
    </PanelTrigger>
  );
};

export default AccordionTrigger;
