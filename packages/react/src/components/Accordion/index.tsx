import React, { useState } from 'react';
import classNames from 'classnames';
import Icon from '../Icon';
import randomId from '../../utils/rndid';
import IconButton from '../IconButton';

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
        id={randomId()}
        type="button"
        aria-expanded={panelState}
        onClick={handleClick}
        className="Accordion__trigger"
      >
        <span>Elements must have sufficient color contrast (14)</span>
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
        <>
          <AccordionControls>
            <IconButton label="Highlight" type="button" icon="highlight" />
          </AccordionControls>
          <AccordionPanel className="Accordion__panel">
            <h3 className="Accordion__panel--heading">Issue Description</h3>
            <p>
              Ensures the contrast between foreground and background colors
              meets WCAG 2 AA contrast ratio thresholds
            </p>
          </AccordionPanel>
        </>
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

type AccordionControlsProps = {
  children?: React.ReactNode | React.ReactNode[];
};

const AccordionControls = ({ children }: AccordionControlsProps) => {
  return <div className="Accordion__controls--wrapper">{children}</div>;
};

export default Accordion;
export { Accordion, AccordionItem, AccordionPanel };
