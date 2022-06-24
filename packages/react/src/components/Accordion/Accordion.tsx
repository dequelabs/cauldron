import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ExpandCollapsePanel, {
  ExpandCollapsePanelProps,
  PanelTrigger
} from '../ExpandCollapsePanel';
import randomId from '../../utils/rndid';
import { IconType } from '../Icon';

interface AccordionProps extends ExpandCollapsePanelProps {
  className?: string;
  children: React.ReactElement[];
  open?: boolean;
  animationTiming?: number | boolean;
}

const Accordion = ({
  children,
  open,
  animationTiming,
  ...otherProps
}: AccordionProps) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const childrenArray = React.Children.toArray(children);
  const trigger = children.length > 0 && children[0].type === AccordionTrigger;

  useEffect(() => {
    setElementId(randomId());
    return;
  }, []);

  return (
    <div className="Accordion">
      <ExpandCollapsePanel
        id={`${elementId}-panel`}
        open={open}
        animationTiming={animationTiming}
        {...otherProps}
      >
        <PanelTrigger
          id={`${elementId}-trigger`}
          iconCollapsed={
            children[0].props.iconCollapsed
              ? children[0].props.iconCollapsed
              : 'triangle-right'
          }
          iconExpanded={
            children[0].props.iconExpanded
              ? children[0].props.iconExpanded
              : 'triangle-down'
          }
          className={classNames(
            children[0].props.className ? children[0].props.className : '',
            'Accordion__trigger'
          )}
          aria-controls={`${elementId}-panel`}
          hideIcon={children[0].props.hideIcon}
          {...children[0].props}
        >
          {children[0]}
        </PanelTrigger>

        {childrenArray.length &&
          React.Children.map(childrenArray, (child, index) => {
            if (trigger && index === 0) return;
            return <>{child}</>;
          })}
      </ExpandCollapsePanel>
    </div>
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
    <div className={classNames('Accordion__panel', className)} {...otherProps}>
      {children}
    </div>
  );
};

export interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactElement;
}

const AccordionTrigger = ({ children }: AccordionTriggerProps) => {
  return <>{children}</>;
};

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
