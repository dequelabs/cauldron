import React, { useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

interface AccordionProps {
  children?: string;
  className?: string;
}

const Accordion = ({ className, children }: AccordionProps) => {
  return <div className="Accordion__container">{children}</div>;
};

type AccordionItemProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const AccordionItem = ({ children, className }: AccordionItemProps) => {
  const [panelState, setPanelState] = useState(false);
  function handleClick() {
    setPanelState(!panelState);
    console.log('Accordion trigger clicked', panelState);
  }

  return (
    <div className="Accordion__item">
      <button
        type="button"
        aria-expanded={panelState}
        onClick={handleClick}
        className="Accordion__trigger"
      >
        Elements must have sufficient color contrast (14)
        <Icon
          type="triangle-right"
          className={classNames(
            panelState
              ? 'Accordion__icon--collapsed'
              : 'Accordion__icon--expanded'
          )}
        />
      </button>
      {panelState && (
        <AccordionPanel className="Accordion__panel">
          Here is the expanded panel
        </AccordionPanel>
      )}
    </div>
  );
};

type AccordionPanelProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  tabIndex?: number;
};

const AccordionPanel = ({ className, children }: AccordionPanelProps) => {
  return (
    <div
      className={classNames(className ? className : '', 'Accordion__panel')}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default Accordion;
export { Accordion, AccordionItem, AccordionPanel };
