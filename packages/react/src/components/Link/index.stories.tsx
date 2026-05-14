import type { Meta, StoryObj } from '@storybook/react';
import Link from './index';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    href: '#',
    children: 'Link'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [undefined, 'button', 'button-secondary']
    },
    thin: { control: 'boolean' },
    children: { control: 'text' },
    linkRef: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { children: 'Read the documentation' }
};

export const Button: Story = {
  args: { variant: 'button', children: 'Primary link' }
};

export const ButtonSecondary: Story = {
  args: { variant: 'button-secondary', children: 'Secondary link' }
};

export const Thin: Story = {
  args: { variant: 'button', thin: true, children: 'Thin link' }
};
