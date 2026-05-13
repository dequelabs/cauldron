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
    }
  }
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    size: 'default',
    children: <BadgeLabel>New</BadgeLabel>
  }
};

export const Small: Story = {
  args: {
    size: 'small',
    children: <BadgeLabel>New</BadgeLabel>
  }
};

export const WithMultipleLabels: Story = {
  args: {
    children: (
      <>
        <BadgeLabel>Status</BadgeLabel>
        <BadgeLabel>Active</BadgeLabel>
      </>
    )
  }
};
