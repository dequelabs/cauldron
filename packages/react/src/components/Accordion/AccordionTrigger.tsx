import React, { createRef, forwardRef, Ref, useRef, useState } from 'react';
import classNames from 'classnames';
import { PanelTrigger } from '../ExpandCollapsePanel';

type AccordionTriggerProps = {
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
  //onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  open: boolean;
};

const AccordionTrigger = ({
  className,
  children,
  //onClick,
  open
}: AccordionTriggerProps) => {
  const buttonRef = createRef<HTMLButtonElement>();

  const handleClick = () => {
    console.log('trigger was clicked');
  };

  return (
    <PanelTrigger
      className={classNames(className ? className : 'Accordion__trigger')}
      onClick={handleClick}
      ref={buttonRef}
    >
      <span>{children}</span>
    </PanelTrigger>
  );
};

export default AccordionTrigger;
