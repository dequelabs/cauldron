import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tooltip, { TooltipHead, TooltipContent } from './index';
import Button from '../Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['text', 'info', 'big']
    },
    placement: {
      control: 'select',
      options: [
        'auto',
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end'
      ]
    },
    association: {
      control: 'radio',
      options: ['aria-describedby', 'aria-labelledby', 'none']
    },
    defaultShow: { control: 'boolean' },
    children: { control: 'text' },
    target: { table: { disable: true } },
    portal: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const Template = (
  args: Omit<React.ComponentProps<typeof Tooltip>, 'target'>
) => {
  const targetRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
      <Button buttonRef={targetRef}>Hover or focus me</Button>
      <Tooltip {...args} target={targetRef} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    children: 'Tooltip content',
    placement: 'bottom',
    defaultShow: true
  }
};

export const Info: Story = {
  render: (args) => <Template {...args} />,
  args: {
    variant: 'info',
    children: 'Additional information about this action.',
    placement: 'bottom',
    defaultShow: true
  }
};

export const Big: Story = {
  render: (args) => <Template {...args} />,
  argTypes: {
    children: { table: { disable: true } }
  },
  args: {
    variant: 'big',
    placement: 'bottom',
    defaultShow: true,
    children: (
      <>
        <TooltipHead>Keyboard shortcut</TooltipHead>
        <TooltipContent>
          Press <kbd>⌘</kbd> + <kbd>K</kbd> to open the command palette.
        </TooltipContent>
      </>
    )
  }
};
