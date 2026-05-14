import type { Meta, StoryObj } from '@storybook/react';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'error',
        'danger',
        'danger-secondary',
        'link',
        'badge'
      ]
    },
    thin: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' }
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' }
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' }
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Tertiary' }
};

export const Error: Story = {
  args: { variant: 'error', children: 'Error' }
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger' }
};

export const LinkStyle: Story = {
  name: 'Link',
  args: { variant: 'link', children: 'Link' }
};

export const Thin: Story = {
  args: { variant: 'primary', thin: true, children: 'Thin' }
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' }
};
