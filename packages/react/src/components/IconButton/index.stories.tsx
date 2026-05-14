import type { Meta, StoryObj } from '@storybook/react';
import IconButton from './index';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    icon: 'pencil',
    label: 'Edit'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error']
    },
    icon: { control: 'text' },
    label: { control: 'text' },
    large: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked', table: { disable: true } },
    as: { table: { disable: true } },
    tooltipProps: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: { variant: 'primary', icon: 'pencil', label: 'Edit' }
};

export const Secondary: Story = {
  args: { variant: 'secondary', icon: 'trash', label: 'Delete' }
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', icon: 'gears', label: 'Settings' }
};

export const Error: Story = {
  args: { variant: 'error', icon: 'trash', label: 'Delete' }
};

export const Large: Story = {
  args: { variant: 'primary', icon: 'pencil', label: 'Edit', large: true }
};

export const Disabled: Story = {
  args: { variant: 'primary', icon: 'pencil', label: 'Edit', disabled: true }
};
