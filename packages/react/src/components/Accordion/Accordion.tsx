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
  className,
  ...otherProps
}: AccordionProps) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [isControlled, setIsControlled] = useState<boolean>();

  const trigger = React.Children.toArray(children).find(
    child => (child as React.ReactElement<any>).type === AccordionTrigger
  );

  const accordionContents = React.Children.toArray(children).filter(
    child =>
      typeof child === 'string' ||
      (child as React.ReactElement<any>).type !== AccordionTrigger
  );

  const handleToggle = () =>
    console.log('opening up: ', open, trigger, isControlled);

  useEffect(() => {
    setElementId(randomId());

    if (typeof open === 'undefined') {
      return setIsControlled(false);
    }
    return;
  }, []);

  return (
    <div className="Accordion">
      {trigger &&
        React.cloneElement(trigger as React.ReactElement<any>, {
          open: open,
          onClick: handleToggle
        })}
      <ExpandCollapsePanel
        open={isControlled ? open : undefined}
        animationTiming={animationTiming}
        {...otherProps}
        id={`${elementId}-panel`}
      >
        {accordionContents}
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
    <div
      className={classNames([className ? className : '', 'Accordion__panel'])}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export interface AccordionTriggerProps {
  elementId: string;
  children: React.ReactElement;
  className: string;
  iconExpanded?: IconType;
  iconCollapsed?: IconType;
  hideIcon?: boolean;
}

const AccordionTrigger = ({
  elementId,
  children,
  className,
  iconExpanded = 'triangle-down',
  iconCollapsed = 'triangle-right',
  hideIcon = false,
  ...otherProps
}: AccordionTriggerProps) => {
  return (
    <>
      <PanelTrigger
        iconCollapsed={iconCollapsed}
        iconExpanded={iconExpanded}
        className={classNames(className ? className : '', 'Accordion__trigger')}
        hideIcon={hideIcon}
        {...otherProps}
        id={`${elementId}-trigger`}
        aria-controls={`${elementId}-panel`}
      >
        {children}
      </PanelTrigger>
    </>
  );
};

export default Accordion;
export { Accordion, AccordionTrigger, AccordionContent };
