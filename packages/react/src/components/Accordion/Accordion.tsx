import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, {
  ExpandCollapsePanelProps,
  PanelTrigger
} from '../ExpandCollapsePanel';
import randomId from '../../utils/rndid';
import { IconType } from '../Icon';

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

const Accordion = ({ className, children, ...otherProps }: AccordionProps) => {
  return (
    <div
      className={classNames(className ? className : '', 'Accordion__container')}
      {...otherProps}
    >
      {children}
    </div>
  );
};

interface AccordionContainerProps extends ExpandCollapsePanelProps {
  className?: string;
  children: React.ReactElement[];
  open?: boolean;
  trigger?: React.ReactNode | React.ReactNode[];
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
  hideIcon?: boolean;
  isControlled?: boolean;
  animationTiming?: number | boolean;
}

const AccordionContainer = ({
  children,
  open = false,
  iconExpanded = 'triangle-down',
  iconCollapsed = 'triangle-right',
  hideIcon = false,
  isControlled = false,
  animationTiming,
  ...otherProps
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
      aria-labelledby={`${elementId}-trigger`}
      animationTiming={animationTiming}
      {...otherProps}
      onToggle={() => setNotControlledOpen(!notControlledOpen)}
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
        hideIcon={hideIcon}
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
}

const AccordionContent = ({
  children,
  className,
  ...otherProps
}: AccordionContentProps) => {
  return (
    <div className={className ? className : 'Accordion__panel'} {...otherProps}>
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
