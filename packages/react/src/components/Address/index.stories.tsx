import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Address, AddressLine, AddressCityStateZip } from './index';

const meta: Meta<typeof Address> = {
  title: 'Components/Address',
  component: Address,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Address>;

export const Default: Story = {
  render: () => (
    <Address>
      <AddressLine>1234 Sesame Street</AddressLine>
      <AddressCityStateZip city="Metrocity" state="AA" zip="8675309" />
    </Address>
  )
};

export const WithoutState: Story = {
  render: () => (
    <Address>
      <AddressLine>1234 Sesame Street</AddressLine>
      <AddressCityStateZip city="Metrocity" zip="8675309" />
    </Address>
  )
};

export const WithoutZip: Story = {
  render: () => (
    <Address>
      <AddressLine>1234 Sesame Street</AddressLine>
      <AddressCityStateZip city="Metrocity" state="AA" zip="" />
    </Address>
  )
};

export const MultipleLines: Story = {
  render: () => (
    <Address>
      <AddressLine>Deque Systems</AddressLine>
      <AddressLine>123 N Pitt St #400</AddressLine>
      <AddressCityStateZip city="Alexandria" state="VA" zip="22314" />
    </Address>
  )
};
