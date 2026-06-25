import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tag, { TagLabel } from './index';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
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

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { size: 'default', children: 'Tag' }
};

export const Small: Story = {
  args: { size: 'small', children: 'Tag' }
};

export const WithLabel: Story = {
  argTypes: {
    children: { table: { disable: true } }
  },
  args: {
    children: (
      <>
        <TagLabel>Status:</TagLabel>
        Active
      </>
    )
  }
};
