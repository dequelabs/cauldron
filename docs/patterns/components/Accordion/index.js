import React, { useState } from 'react';
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  Code
} from '@deque/cauldron-react/';
import PropDocs from '../../../Demo/PropDocs';
import './index.css';
import { children, className } from '../../../props';

export const AccordionDemo = () => {
  return (
    <div>
      <div className="data-list-demo">
        <h1>Accordion</h1>
        <h2>Component Description</h2>
        <p>
          An accordion is a vertically stacked set of interactive headings that
          each contain a title, content snippet, or thumbnail representing a
          section of content. The headings function as controls that enable
          users to reveal or hide their associated sections of content.
          Accordions are commonly used to reduce the need to scroll when
          presenting multiple sections of content on a single page.
        </p>
        <h2>Try it out</h2>
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
          <AccordionTrigger>Accordion #1</AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
        </Accordion>
        <Accordion>
          <AccordionTrigger>Accordion #2</AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
        </Accordion>
        <Accordion>
          <AccordionTrigger>Accordion #3</AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
        </Accordion>
        <h3>Accessibility features</h3>
        <p>
          Out of the box, this component handles recommended ARIA attributes
          (e.g., aria-expanded, aria-controls, etc) using unique/random ids
          without any additional effort. However, you can also provide your own
          ids for the trigger and content elements if you need to.
        </p>

        <p>Example...</p>

        <h2>Examples</h2>
        <h3>Controlled</h3>
        <Code role="region" tabIndex={0}>
          {`import React, { useEffect, useState } from 'react';
  import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from '@deque/cauldron-react/';

const ControlledAccordion = ({ label }) => {
  const [open, setIsOpen] = useState(false);

  return (
    <Accordion
        open={open}
        onToggle={() => setIsOpen(!open)}
      >
        <AccordionTrigger
          className={classNames('Accordion__trigger underline'
          )}
          iconExpanded="triangle-down"
          iconCollapsed="triangle-right"
        >
          {label}
        </AccordionTrigger>
        <AccordionContent className="Accordion__panel">
          Here is some content
        </AccordionContent>
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
    <AccordionTrigger>Accordion #3</AccordionTrigger>
    <AccordionContent>Here is some content</AccordionContent>
</Accordion>`}
        </Code>
      </div>
      <div className="Demo-props">
        <h2>Props</h2>
        <h3>
          <code>Accordion</code>
        </h3>
        <p>
          The <code>Accordion</code> supports all the props from the{' '}
          <a href="/components/ExpandCollapsePanel">ExpandCollapsePanelProps</a>{' '}
          as well as:
        </p>

        <PropDocs
          docs={{
            className,
            children,
            open: {
              type: 'boolean',
              description: 'Initial collapsed state of ExpandCollapsePanel',
              default: 'false'
            }
          }}
        />

        <h3>
          <code>AccordionTrigger</code>
        </h3>
        <p>
          The <code>AccordionTrigger</code> supports all the props from the{' '}
          <a href="/components/ExpandCollapsePanel">PanelTrigger</a> as well as:
        </p>
        <PropDocs
          docs={{
            children
          }}
        />

        <h3>
          <code>AccordionContent</code>
        </h3>
        <p>
          The <code>AccordionTrigger</code> supports all the props supported by
          HTML Div elements as well as:
        </p>
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
    <Accordion open={open} onToggle={() => setIsOpen(!open)}>
      <AccordionTrigger className={'Accordion__trigger underline'}>
        {label}
      </AccordionTrigger>
      <AccordionContent className="Accordion__panel">
        Here is some content
      </AccordionContent>
    </Accordion>
  );
};

export default AccordionDemo;
