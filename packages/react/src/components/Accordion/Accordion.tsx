import React from 'react';
import classnames from 'classnames';
import ExpandCollapsePanel, {
  ExpandCollapsePanelProps,
  PanelTrigger
} from '../ExpandCollapsePanel';
import { useId } from 'react-id-generator';

export interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactElement;
  heading?:
    | React.ReactElement
    | {
        level: string | undefined;
      };
}

const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
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

const Accordion = ({ children, ...otherProps }: AccordionProps) => {
  const childrenArray = React.Children.toArray(children);

  const trigger = childrenArray.find(
    child => (child as React.ReactElement<any>).type === AccordionTrigger
  );

  const panelElement = childrenArray.find(
    child =>
      typeof child === 'string' ||
      (child as React.ReactElement<any>).type === AccordionContent
  );

  const isValid = !!(
    React.isValidElement(trigger) && React.isValidElement(panelElement)
  );
  const elementId = useId();

  if (!isValid) {
    console.warn('MUST provide both a trigger and panelElement', {
      trigger: trigger,
      panelElement: panelElement,
      isValid: isValid
    });
    return null;
  }

  return (
    <div className="Accordion">
      <ExpandCollapsePanel
        id={panelElement.props.id || `${elementId}-panel`}
        className={classnames(panelElement.props.className)}
        {...panelElement.props.otherProps}
      >
        <PanelTrigger
          iconCollapsed="triangle-right"
          iconExpanded="triangle-down"
          className={classnames('Accordion__trigger', trigger.props.className)}
          aria-controls={panelElement.props.id || `${elementId}-panel`}
          heading={trigger.props.heading}
          {...trigger.props.otherProps}
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
