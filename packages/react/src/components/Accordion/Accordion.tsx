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
  trigger?: React.ReactNode | React.ReactNode[];
  hideIcon?: boolean;
  animationTiming?: number | boolean;
}

const Accordion = ({
  children,
  open,
  hideIcon = false,
  animationTiming,
  ...otherProps
}: AccordionProps) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const childrenArray = React.Children.toArray(children);
  const isControlled = typeof open === 'undefined' ? undefined : open;

  useEffect(() => {
    setElementId(randomId());

    if (typeof open === 'undefined') {
      //return setIsControlled(false);
    }
    return;
  }, []);

  return (
    <div className="Accordion">
      <ExpandCollapsePanel
        open={isControlled}
        animationTiming={animationTiming}
        {...otherProps}
        id={`${elementId}-panel`}
      >
        <PanelTrigger
          id={`${elementId}-trigger`}
          iconCollapsed={children[0].props.iconCollapsed || 'triangle-right'}
          iconExpanded={children[0].props.iconExpanded || 'triangle-down'}
          className={classNames(
            children[0].props.className ? children[0].props.className : '',
            'Accordion__trigger'
          )}
          aria-controls={`${elementId}-panel`}
          hideIcon={hideIcon}
        >
          {children[0]}
        </PanelTrigger>
        {React.Children.map(childrenArray, (child, index) => {
          if (index === 0) return;
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
    <div className={className ? className : 'Accordion__panel'} {...otherProps}>
      {children}
    </div>
  );
};

export interface AccordionTriggerProps {
  children: React.ReactElement | React.ReactElement[];
  iconExpanded: IconType;
  iconCollapsed: IconType;
}

const AccordionTrigger = ({
  children,
  iconExpanded,
  iconCollapsed
}: AccordionTriggerProps) => {
  return <>{children}</>;
};

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
