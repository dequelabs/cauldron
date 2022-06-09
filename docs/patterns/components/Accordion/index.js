import React, { useState } from 'react';
import {
  Accordion,
  AccordionContainer,
  AccordionTrigger,
  AccordionContent,
  Code
} from '@deque/cauldron-react/';
import classNames from 'classnames';
import PropDocs from '../../../Demo/PropDocs';
import './index.css';
import { children, className } from '../../../props';

export const AccordionDemo = () => {
  return (
    <div>
      <div className="data-list-demo">
        <h1>Accordion</h1>
        <h2>Demo</h2>
        <h3>Controlled</h3>

        <p>
          If you need to manually control the open/closed state of the panel,
          you can do this by setting the open prop and handling changes with
          onToggle.
        </p>
        <ControlledAccordion label="Accordion #1" />
        <ControlledAccordion label="Accordion #2" />
        <ControlledAccordion label="Accordion #3" />

        <h3>Uncontrolled</h3>

        <Accordion tabIndex={0}>
          <AccordionContainer>
            <AccordionTrigger>Accordion #1</AccordionTrigger>
            <AccordionContent>Here is some content</AccordionContent>
          </AccordionContainer>
        </Accordion>

        <Accordion>
          <AccordionContainer>
            <AccordionTrigger>Accordion #2</AccordionTrigger>
            <AccordionContent>Here is some content</AccordionContent>
          </AccordionContainer>
        </Accordion>

        <Accordion>
          <AccordionContainer>
            <AccordionTrigger>Accordion #3</AccordionTrigger>
            <AccordionContent>Here is some content</AccordionContent>
          </AccordionContainer>
        </Accordion>

        <h2>Code Sample</h2>
        <h3>Controlled</h3>
        <Code role="region" tabIndex={0}>
          {`import React, { useEffect, useState } from 'react';
  import {
  Accordion,
  AccordionContainer,
  AccordionTrigger,
  AccordionContent,
} from '@deque/cauldron-react/';

const ControlledAccordion = ({ label }) => {
  const [open, setIsOpen] = useState(false);

  return (
    <Accordion>
      <AccordionContainer
        open={open}
        onToggle={() => setIsOpen(!open)}
        setIsOpen={setIsOpen}
        isControlled
      >
        <AccordionTrigger
          className={classNames(
            open ? 'expanded' : '',
            'Accordion__trigger underline'
          )}
          iconExpanded="triangle-down"
          iconCollapsed="triangle-right"
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
      </AccordionContainer>
    </Accordion>
  );
};`}
        </Code>
        <p>
          Then the controlled component would be called with something like:
        </p>
        <Code role="region" tabIndex={0}>
          {`<ControlledAccordion label="Accordion #1" />`}
        </Code>
        <h3>Uncontrolled</h3>
        <Code role="region" tabIndex={0}>
          {`<Accordion>
  <AccordionContainer>
    <AccordionTrigger>Accordion #3</AccordionTrigger>
    <AccordionContent>Here is some content</AccordionContent>
  </AccordionContainer>
</Accordion>`}
        </Code>
      </div>
      <div className="Demo-props">
        <h2>Props</h2>
        <h3>
          <code>Accordion</code>
        </h3>

        <PropDocs
          docs={{
            className,
            children
          }}
        />
        <h3>
          <code>AccordionContainer</code>
        </h3>

        <PropDocs
          docs={{
            className,
            children,
            open: {
              type: 'boolean',
              description: 'Initial collapsed state of ExpandCollapsePanel',
              default: 'false'
            },
            animationTiming: {
              type: 'number | boolean',
              description:
                'Animation time of expand/collapse in ms. Animation disabled when set to false.',
              default: 250
            },
            setIsOpen: {
              type: '(e: React.MouseEvent<HTMLButtonElement>) => void',
              description:
                'onToggle handler for the panel. The original event object will be passed.',
              default: 'function () {}'
            },
            iconCollapsed: {
              type: 'IconType',
              description: 'name of an <Icon> component',
              default: 'triangle-right'
            },
            iconExpanded: {
              type: 'IconType',
              description: 'name of an <Icon> component',
              default: 'triangle-down'
            },
            shouldHideIcon: {
              type: 'boolean',
              description:
                'used to control whether an icon appears on the trigger element',
              default: 'false'
            },
            isControlled: {
              type: 'boolean',
              description:
                'used when controlling the opening and closing of the component via "open" prop',
              default: 'false'
            }
          }}
        />

        <h3>
          <code>AccordionTrigger</code>
        </h3>
        <PropDocs
          docs={{
            children
          }}
        />

        <h3>
          <code>AccordionContent</code>
        </h3>
        <PropDocs
          docs={{
            children,
            className
          }}
        />
      </div>
    </div>
  );
};

AccordionDemo.displayName = 'AccordionDemo';

const ControlledAccordion = ({ label }) => {
  const [open, setIsOpen] = useState(false);

  return (
    <Accordion>
      <AccordionContainer
        open={open}
        onToggle={() => setIsOpen(!open)}
        setIsOpen={setIsOpen}
        isControlled
      >
        <AccordionTrigger
          className={classNames('Accordion__trigger underline')}
          iconExpanded="triangle-down"
          iconCollapsed="triangle-right"
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
      </AccordionContainer>
    </Accordion>
  );
};

export default AccordionDemo;
