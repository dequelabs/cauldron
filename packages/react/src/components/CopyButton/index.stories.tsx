import type { Meta, StoryObj } from '@storybook/react';
import CopyButton from './index';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'tertiary']
    },
    tooltipPlacement: {
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
    value: { control: 'text' },
    children: { control: 'text' },
    notificationLabel: { control: 'text' },
    hideVisibleLabel: { control: 'boolean' },
    onCopy: { action: 'copied', table: { disable: true } }
  },
  args: {
    value: 'text to copy'
  }
};

export default meta;

type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    value: 'body { color: green; }',
    children: 'Copy CSS Selector',
    notificationLabel: 'CSS Selector Copied!'
  }
};

export const HiddenVisibleLabel: Story = {
  args: {
    hideVisibleLabel: true
  }
};

export const Primary: Story = {
  args: { variant: 'primary' }
};

export const Secondary: Story = {
  args: { variant: 'secondary' }
};
