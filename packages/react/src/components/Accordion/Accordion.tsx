import React from 'react';
import classnames from 'classnames';
import ExpandCollapsePanel, {
  ExpandCollapsePanelProps,
  PanelTrigger
} from '../ExpandCollapsePanel';
import { useId } from 'react-id-generator';
import PropTypes from 'prop-types';

export interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactElement;
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

const Accordion = ({ children }: AccordionProps) => {
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

  const { className: triggerClassName, ...triggerProps } = trigger.props;

  const elementId = useId();

  return (
    <div className="Accordion">
      <ExpandCollapsePanel
        id={panelElement.props.id || `${elementId}-panel`}
        {...panelElement.props}
      >
        <PanelTrigger
          iconCollapsed="triangle-right"
          iconExpanded="triangle-down"
          className={classnames('Accordion__trigger', trigger.props.className)}
          aria-controls={panelElement.props.id || `${elementId}-panel`}
          heading={trigger.props.heading}
          {...trigger.props}
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

Accordion.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

AccordionTrigger.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.shape({
    level: PropTypes.number
  })
};

AccordionContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
