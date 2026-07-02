import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  MetadataList,
  MetadataListItem,
  MetadataListLabel,
  MetadataListValue
} from './index';

const meta: Meta<typeof MetadataList> = {
  title: 'Components/MetadataList',
  component: MetadataList,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal'
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    children: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof MetadataList>;

const Template = (args: React.ComponentProps<typeof MetadataList>) => (
  <MetadataList {...args}>
    <MetadataListItem>
      <MetadataListLabel>Status</MetadataListLabel>
      <MetadataListValue>Active</MetadataListValue>
    </MetadataListItem>
    <MetadataListItem>
      <MetadataListLabel>Created</MetadataListLabel>
      <MetadataListValue>January 1, 2026</MetadataListValue>
    </MetadataListItem>
    <MetadataListItem>
      <MetadataListLabel>Owner</MetadataListLabel>
      <MetadataListValue>Jane Doe</MetadataListValue>
    </MetadataListItem>
  </MetadataList>
);

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    orientation: 'horizontal'
  }
};

export const Vertical: Story = {
  render: (args) => <Template {...args} />,
  args: {
    orientation: 'vertical'
  }
};
