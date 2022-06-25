import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import ExpandCollapsePanel, {
  ExpandCollapsePanelProps,
  PanelTrigger
} from '../ExpandCollapsePanel';
import randomId from '../../utils/rndid';

export interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactElement;
}

const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
  return <>{children}</>;
};

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
  className: string;
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
  const [elementId, setElementId] = useState<string | null>(null);
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find(
    child => (child as React.ReactElement<any>).type === AccordionTrigger
  );
  const panelElement = childrenArray.find(
    child => (child as React.ReactElement<any>).type === AccordionContent
  );

  useEffect(() => {
    setElementId(randomId());
    return;
  }, []);
  if (React.isValidElement(trigger) && React.isValidElement(panelElement)) {
    return (
      <div className="Accordion">
        <ExpandCollapsePanel
          id={panelElement.props.id || `${elementId}-panel`}
          {...otherProps}
        >
          <PanelTrigger
            id={trigger.props.id || `${elementId}-trigger`}
            iconCollapsed="triangle-right"
            iconExpanded="triangle-down"
            className={classnames(
              'Accordion__trigger',
              trigger.props.className
            )}
            aria-controls={panelElement.props.id || `${elementId}-panel`}
            {...trigger.props.otherProps}
          >
            {trigger}
          </PanelTrigger>
          {panelElement}
        </ExpandCollapsePanel>
      </div>
    );
  }
};

Accordion.displayName = 'Accordion';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
