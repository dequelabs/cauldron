import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from './index';

const meta: Meta<typeof DescriptionList> = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  argTypes: {
    collapsed: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<typeof DescriptionList>;

const items = (
  <>
    <DescriptionListItem>
      <DescriptionTerm>First name</DescriptionTerm>
      <DescriptionDetails>Frank</DescriptionDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionTerm>Last name</DescriptionTerm>
      <DescriptionDetails>Zappa</DescriptionDetails>
    </DescriptionListItem>
    <DescriptionListItem>
      <DescriptionTerm>Email</DescriptionTerm>
      <DescriptionDetails>frank@zappa.io</DescriptionDetails>
    </DescriptionListItem>
  </>
);

export const Default: Story = {
  render: (args) => <DescriptionList {...args}>{items}</DescriptionList>
};

export const Collapsed: Story = {
  args: { collapsed: true },
  render: (args) => <DescriptionList {...args}>{items}</DescriptionList>
};
