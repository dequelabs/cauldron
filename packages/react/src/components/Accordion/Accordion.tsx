import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';
import randomId from '../../utils/rndid';
import { IconType } from '../Icon';

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Accordion = ({ className, children, ...props }: AccordionProps) => {
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
  setIsOpen?: (open: boolean) => void;
  trigger?: React.ReactNode | React.ReactNode[];
  other?: React.HTMLAttributes<HTMLDivElement>;
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
  shouldHideIcon?: boolean;
  isControlled?: boolean;
}

const AccordionContainer = ({
  children,
  open = false,
  setIsOpen,
  iconExpanded = 'triangle-down',
  iconCollapsed = 'triangle-right',
  shouldHideIcon = false,
  isControlled = false,
  ...props
}: AccordionContainerProps) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [notControlledOpen, setNotControlledOpen] = useState(false);

  useEffect(() => {
    setElementId(randomId());
  }, []);

  if (!isControlled) {
    return (
      <ExpandCollapsePanel
        id={`${elementId}-panel`}
        open={notControlledOpen}
        onToggle={() => setNotControlledOpen(!notControlledOpen)}
        aria-labelledby={`${elementId}-trigger`}
        {...props}
      >
        <PanelTrigger
          id={`${elementId}-trigger`}
          iconCollapsed={iconCollapsed}
          iconExpanded={iconExpanded}
          className={classNames(
            children[0].props.className
              ? children[0].props.className
              : 'Accordion__trigger',
            notControlledOpen ? 'expanded' : ''
          )}
          aria-controls={`${elementId}-panel`}
          shouldHideIcon={shouldHideIcon}
        >
          {children[0]}
        </PanelTrigger>
        {children[1]}
      </ExpandCollapsePanel>
    );
  }

  if (setIsOpen) {
    return (
      <>
        <ExpandCollapsePanel
          id={`${elementId}-panel`}
          open={open}
          onToggle={() => setIsOpen(!open)}
          {...props}
          aria-labelledby={`${elementId}-trigger`}
        >
          <PanelTrigger
            id={`${elementId}-trigger`}
            iconCollapsed={iconCollapsed}
            iconExpanded={iconExpanded}
            className={classNames(
              children[0].props.className
                ? children[0].props.className
                : 'Accordion__trigger'
            )}
            aria-controls={`${elementId}-panel`}
            shouldHideIcon={shouldHideIcon}
          >
            {children[0]}
          </PanelTrigger>
          {children[1]}
        </ExpandCollapsePanel>
      </>
    );
  }
};

type AccordionContentProps = {
  children: React.ReactElement;
  className: string;
};

const AccordionContent = ({ children, className }: AccordionContentProps) => {
  return (
    <div className={className ? className : 'Accordion__panel'}>{children}</div>
  );
};

type AccordionTriggerProps = {
  children: React.ReactElement | React.ReactElement[];
};

const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
  return <>{children}</>;
};

export { AccordionContainer, Accordion, AccordionTrigger, AccordionContent };
