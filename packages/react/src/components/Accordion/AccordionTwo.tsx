import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';
import randomId from './../../../src/utils/rndid';
import { IconType } from '../Icon';

type AccordionProps = {
  className?: string;
  children: React.ReactNode;
};

const AccordionTwo = ({ className, children, ...props }: AccordionProps) => {
  return (
    <div
      className={classNames(className ? className : '', 'Accordion__container')}
      {...props}
    >
      {children}
    </div>
  );
};

export interface AccordionContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactElement[];
  open?: boolean;
  setIsOpen?: any;
  trigger?: React.ReactNode | React.ReactNode[];
  other?: React.HTMLAttributes<HTMLDivElement>;
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
}

const AccordionContainer = ({
  className,
  children,
  open = false,
  setIsOpen,
  iconExpanded,
  iconCollapsed,
  ...props
}: AccordionContainerProps) => {
  const [elementId, setElementId] = useState<string | null>(null);

  useEffect(() => {
    setElementId(randomId());
  }, []);

  if (setIsOpen && open) {
    return (
      <>
        <ExpandCollapsePanel id={`${elementId}-panel`} open={open} {...props}>
          <PanelTrigger
            iconCollapsed={iconCollapsed}
            iconExpanded={iconExpanded}
            className={children[0].props.className}
            aria-controls={`${elementId}-panel`}
          >
            {children[0]}
          </PanelTrigger>
          {children[1]}
        </ExpandCollapsePanel>
      </>
    );
  }

  return (
    <ExpandCollapsePanel id={`${elementId}-panel`} {...props}>
      <PanelTrigger
        aria-controls={`${elementId}-panel`}
        className={children[0].props.className}
      >
        {children[0]}
      </PanelTrigger>
      {children[1]}
    </ExpandCollapsePanel>
  );
};

type AccordionContentProps = {
  children: React.ReactElement;
  className: string;
};

const AccordionContent = ({ children, className }: AccordionContentProps) => {
  return <div className={className}>{children}</div>;
};

type AccordionPanelTriggerProps = {
  className?: string;
  children: React.ReactElement | React.ReactElement[];
};

const AccordionPanelTrigger = ({
  className,
  children
}: AccordionPanelTriggerProps) => {
  return <>{children}</>;
};

export {
  AccordionContainer,
  AccordionTwo,
  AccordionPanelTrigger,
  AccordionContent
};
