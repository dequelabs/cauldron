import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, { PanelTrigger } from '../ExpandCollapsePanel';
import randomId from '../../utils/rndid';
import { IconType } from '../Icon';

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  props?: React.HTMLAttributes<HTMLDivElement>;
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

interface AccordionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactElement[];
  open?: boolean;
  trigger?: React.ReactNode | React.ReactNode[];
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
  shouldHideIcon?: boolean;
  isControlled?: boolean;
  animationTiming?: number | boolean;
  props?: React.HTMLAttributes<HTMLDivElement>;
}

const AccordionContainer = ({
  children,
  open = false,
  iconExpanded = 'triangle-down',
  iconCollapsed = 'triangle-right',
  shouldHideIcon = false,
  isControlled = false,
  animationTiming,
  ...props
}: AccordionContainerProps) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [notControlledOpen, setNotControlledOpen] = useState(false);

  useEffect(() => {
    setElementId(randomId());
  }, []);

  return (
    <ExpandCollapsePanel
      id={`${elementId}-panel`}
      open={notControlledOpen}
      onToggle={() => setNotControlledOpen(!notControlledOpen)}
      aria-labelledby={`${elementId}-trigger`}
      animationTiming={animationTiming}
      {...props}
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
  );
};

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
  className: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}

const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionContentProps) => {
  return (
    <div className={className ? className : 'Accordion__panel'} {...props}>
      {children}
    </div>
  );
};

export interface AccordionTriggerProps {
  children: React.ReactElement | React.ReactElement[];
}

const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
  return <>{children}</>;
};

export default Accordion;
export { Accordion, AccordionContainer, AccordionTrigger, AccordionContent };
