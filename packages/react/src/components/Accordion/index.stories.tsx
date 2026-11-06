import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Accordion, { AccordionTrigger, AccordionContent } from './index';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    animationTiming: { control: 'number' },
    onToggle: { action: 'toggled', table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionTrigger>Frequently asked questions</AccordionTrigger>
      <AccordionContent>
        The accordion is uncontrolled by default — it tracks its own open state
        and starts collapsed.
      </AccordionContent>
    </Accordion>
  )
};

export const InitiallyOpen: Story = {
  args: { open: true },
  render: (args) => (
    <Accordion {...args}>
      <AccordionTrigger>What is Cauldron?</AccordionTrigger>
      <AccordionContent>
        Cauldron is Deque&apos;s accessible design system for building inclusive
        web experiences.
      </AccordionContent>
    </Accordion>
  )
};

export const Controlled: Story = {
  argTypes: {
    open: { table: { disable: true } },
    onToggle: { table: { disable: true } }
  },
  render: () => {
    const ControlledAccordion = () => {
      const [open, setOpen] = useState(true);
      return (
        <Accordion open={open} onToggle={() => setOpen((v) => !v)}>
          <AccordionTrigger>Controlled accordion</AccordionTrigger>
          <AccordionContent>
            The parent component manages the open state via the
            <code> open </code> and <code> onToggle </code> props.
          </AccordionContent>
        </Accordion>
      );
    };
    return <ControlledAccordion />;
  }
};

export const WithHeading: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionTrigger heading={{ level: '3' }}>
        Heading-wrapped trigger
      </AccordionTrigger>
      <AccordionContent>
        Pass <code>heading</code> to wrap the trigger in a heading element of
        the appropriate level.
      </AccordionContent>
    </Accordion>
  )
};
