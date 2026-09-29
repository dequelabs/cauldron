import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '../Button';
import { Alert, AlertContent, AlertActions } from './index';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'warning']
    },
    heading: { control: 'text' },
    children: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof Alert>;

const Template = (args: React.ComponentProps<typeof Alert>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Alert</Button>
      <Alert {...args} show={open} onClose={() => setOpen(false)}>
        <AlertContent>
          Are you sure you want to perform this action? This cannot be undone.
        </AlertContent>
        <AlertActions>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    variant: 'default',
    heading: 'Confirm action'
  }
};

export const Warning: Story = {
  render: (args) => <Template {...args} />,
  args: {
    variant: 'warning',
    heading: 'Warning'
  }
};
