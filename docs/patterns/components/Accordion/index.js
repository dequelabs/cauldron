import React, { useState } from 'react';
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  Code,
  Link
} from '@deque/cauldron-react/';
import PropDocs from '../../../Demo/PropDocs';
import './index.css';
import { children, className } from '../../../props';

export const AccordionDemo = () => {
  return (
    <div>
      <div className="Demo data-list-demo">
        <h1>Accordion</h1>
        <h2>Component Description</h2>
        <p>
          The
          <Link href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/">
            ARIA Authoring Practices Guide (APG)
          </Link>
          describes an Accordion as, " ...a vertically stacked set of
          interactive headings that each contain a title, content snippet, or
          thumbnail representing a section of content. The headings function as
          controls that enable users to reveal or hide their associated sections
          of content. Accordions are commonly used to reduce the need to scroll
          when presenting multiple sections of content on a single page."
        </p>
        <h2>Try it out</h2>
        <h3>Standard</h3>
        <Accordion>
          <AccordionTrigger heading={{ level: 4 }}>
            Accordion #1
          </AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
        </Accordion>
        <Accordion>
          <AccordionTrigger heading={{ level: 4 }}>
            Accordion #2
          </AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
        </Accordion>
        <Accordion>
          <AccordionTrigger heading={{ level: 4 }}>
            Accordion #3
          </AccordionTrigger>
          <AccordionContent>Here is some content</AccordionContent>
        </Accordion>
        <Code role="region" tabIndex={0}>
          {`<Accordion>
    <AccordionTrigger headingLevel="h4">Accordion #3</AccordionTrigger>
    <AccordionContent>Here is some content</AccordionContent>
</Accordion>`}
        </Code>
        <h3>Controlled</h3>
        <p>
          If you need to manually control the open/closed state of the panel,
          you can do this by setting the open prop and handling changes with
          onToggle.
        </p>
        <ControlledAccordion label="Accordion #1" heading={{ level: 4 }} />
        <ControlledAccordion label="Accordion #2" heading={{ level: 4 }} />
        <ControlledAccordion label="Accordion #3" heading={{ level: 4 }} />
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
    <Accordion open={open} onToggle={() => setIsOpen(!open)}>
      <AccordionTrigger headingLevel="h4">
        {label}
      </AccordionTrigger>
      <AccordionContent>
        Here is some content
      </AccordionContent>
    </Accordion>
  );
};`}
        </Code>
      </div>
      <div className="Demo-props">
        <h2>Props</h2>
        <h3>
          <code>Accordion</code>
        </h3>
        <p>
          The <code>Accordion</code> supports all the props from the{' '}
          <Link href="/components/ExpandCollapsePanel">
            ExpandCollapsePanelProps
          </Link>{' '}
          including/in addition to the following:
        </p>

        <PropDocs
          docs={{
            className,
            children,
            open: {
              type: 'boolean',
              description: 'Initial collapsed state of ExpandCollapsePanel',
              default: 'false'
            },
            onToggle: {
              type: '(e: React.MouseEvent<HTMLButtonElement>) => void',
              description:
                'onToggle handler for the panel. The original event object will be passed.',
              default: 'function () {}'
            }
          }}
        />

        <h3>
          <code>AccordionTrigger</code>
        </h3>
        <p>
          The <code>AccordionTrigger</code> extends{' '}
          <code>React.HTMLAttributes&lt;HTMLButtonElement&gt;</code> and also
          supports:
        </p>
        <PropDocs
          docs={{
            children,
            headingLevel: {
              type: 'object',
              description:
                'Sets a wrapper element for the trigger button with an appropriate heading level. If a heading level is not provided, a fragment is returned.',
              default: undefined
            }
          }}
        />

        <h3>
          <code>AccordionContent</code>
        </h3>
        <p>
          The <code>AccordionTrigger</code> extends{' '}
          <code>React.HTMLAttributes&lt;HTMLDivElement&gt;</code> and supports
          spreading of any props supported by the element, as well as:
        </p>
        <PropDocs
          docs={{
            className,
            children
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
      <AccordionTrigger heading={{ level: 4 }}>{label}</AccordionTrigger>
      <AccordionContent>Here is some content</AccordionContent>
    </Accordion>
  );
};

export default AccordionDemo;
