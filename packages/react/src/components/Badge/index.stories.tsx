import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Badge, { BadgeLabel } from './index';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['default', 'small']
    },
    children: { control: 'text' }
  }
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    size: 'default',
    children: 'Value'
  }
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Value'
  }
};

export const WithLabel: Story = {
  argTypes: {
    children: { table: { disable: true } }
  },
  args: {
    children: (
      <>
        <BadgeLabel>Label:</BadgeLabel>
        value
      </>
    )
  }
};
