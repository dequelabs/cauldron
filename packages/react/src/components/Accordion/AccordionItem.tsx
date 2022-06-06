import React from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';

type AccordionItemProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  tabIndex?: number;
};

const AccordionItem = ({ className, children }: AccordionItemProps) => {
  return (
    <div className={classNames(className ? className : '', '')} tabIndex={-1}>
      {children}
    </div>
  );
};

export default AccordionItem;
