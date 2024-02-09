import React from 'react';
import classnames from 'classnames';
import ExpandCollapsePanel, {
  ExpandCollapsePanelProps,
  PanelTrigger
} from '../ExpandCollapsePanel';
import { useId } from 'react-id-generator';

export interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  heading?:
    | React.ReactElement
    | {
        level: string | undefined;
      };
}

const AccordionTrigger = ({
  children,
  ...triggerProps
}: AccordionTriggerProps) => {
  return <>{children}</>;
};

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

const AccordionContent = ({
  children,
  className,
  ...otherProps
}: AccordionContentProps) => {
  return (
    <div className={classnames('Accordion__panel', className)} {...otherProps}>
      {children}
    </div>
  );
};

interface AccordionProps extends ExpandCollapsePanelProps {
  children: React.ReactNode;
}

const Accordion = ({
  children,
  open,
  onToggle,
  animationTiming,
  ...props
}: AccordionProps) => {
  const elementId = useId();

  const childrenArray = React.Children.toArray(children);

  const trigger = childrenArray.find(
    (child) =>
      typeof child === 'string' ||
      (child as React.ReactElement<any>).type === AccordionTrigger
  ) as unknown as typeof AccordionTrigger;

  const panelElement = childrenArray.find(
    (child) =>
      typeof child === 'string' ||
      (child as React.ReactElement<any>).type === AccordionContent
  );

  const isValid = !!(
    React.isValidElement(trigger) && React.isValidElement(panelElement)
  );

  if (!isValid) {
    console.warn(
      'Must provide <AccordionTrigger /> and <AccordionContent /> element(s). You provided:',
      {
        trigger: trigger,
        panelElement: panelElement,
        isValid: isValid
      }
    );
    return null;
  }

  return (
    <div className="Accordion" {...props}>
      <ExpandCollapsePanel
        id={panelElement.props.id || `${elementId}-panel`}
        open={open}
        onToggle={onToggle}
        animationTiming={animationTiming}
        {...panelElement.props}
      >
        <PanelTrigger
          iconCollapsed="triangle-right"
          iconExpanded="triangle-down"
          className={classnames(
            'Accordion__trigger',
            (trigger.props as AccordionTriggerProps).className
          )}
          aria-controls={panelElement.props.id || `${elementId}-panel`}
          heading={(trigger.props as AccordionTriggerProps).heading}
          {...(trigger.props as AccordionTriggerProps)}
        >
          {trigger}
        </PanelTrigger>
        {panelElement}
      </ExpandCollapsePanel>
    </div>
  );
};

Accordion.displayName = 'Accordion';
AccordionContent.displayName = 'AccordionContent';
AccordionTrigger.displayName = 'AccordionTrigger';

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
