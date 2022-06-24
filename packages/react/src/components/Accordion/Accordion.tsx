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

interface AccordionProps extends ExpandCollapsePanelProps {
  children: React.ReactNode;
  panelId?: string;
  triggerId?: string;
}

const Accordion = ({
  children,
  triggerId,
  panelId,
  ...otherProps
}: AccordionProps) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find(
    child => (child as React.ReactElement<any>).type === AccordionTrigger
  );

  useEffect(() => {
    setElementId(randomId());
    return;
  }, []);
  if (trigger && React.isValidElement(trigger)) {
    return (
      <div className="Accordion">
        <ExpandCollapsePanel
          id={panelId || `${elementId}-panel`}
          {...otherProps}
        >
          <PanelTrigger
            id={triggerId || `${elementId}-trigger`}
            iconCollapsed="triangle-right"
            iconExpanded={'triangle-down'}
            className={classnames(
              'Accordion__trigger',
              trigger.props.className
            )}
            aria-controls={panelId || `${elementId}-panel`}
            hideIcon={trigger.props.hideIcon}
            {...trigger.props.otherProps}
          >
            {trigger}
          </PanelTrigger>

          {childrenArray.length &&
            React.Children.map(childrenArray, (child, index) => {
              if (trigger && index === 0) return;
              return <>{child}</>;
            })}
        </ExpandCollapsePanel>
      </div>
    );
  }
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

Accordion.displayName = 'Accordion';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
