import React, { useState } from 'react';
import Demo from '../../../Demo';
import {
  Accordion,
  AccordionContainer,
  AccordionTrigger,
  AccordionContent,
  Code
} from '@deque/cauldron-react/';
import classNames from 'classnames';
import './index.css';
import { children, className } from '../../../props';

const accordionComponentNames = [
  'Accordion',
  'AccordionContainer',
  'AccordionTrigger',
  'AccordionContent'
];

export const AccordionDemo = () => {
  return (
    <div>
      <div className="data-list-demo">
        <Demo
          component={Accordion}
          customImport={`import {\n  ${accordionComponentNames.join(
            ',\n  '
          )}\n} from '@deque/cauldron-react'`}
          propDocs={{
            ...children,
            children: {
              description:
                'Only required for <Address>. If children is undefined for <AddressLine>, it will not render.'
            },
            className,
            city: {
              type: 'node',
              description:
                '<AddressCityStateZip> Only. The city to be combined with state and zip in a single line.'
            },
            state: {
              type: 'node',
              description:
                '<AddressCityStateZip> Only. The state to be combined with city and zip in a single line.'
            },
            zip: {
              type: 'node',
              description:
                '<AddressCityStateZip> Only. The zip code to be combined with city and state in a single line.'
            }
          }}
          states={[]}
        >
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

          <Accordion>
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
            {`const ControlledAccordion = ({ label }) => {
  
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
        </Demo>
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
          className={classNames(
            'Accordion__trigger underline',
            open ? 'expanded' : ''
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
};

export default AccordionDemo;
