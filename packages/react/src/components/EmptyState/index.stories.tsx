import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './index';
import Button from '../Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    description: { control: 'text' },
    primaryActions: { table: { disable: true } },
    secondaryActions: { table: { disable: true } }
  },
  args: {
    heading: 'No results found',
    description: 'Try adjusting your filters or search terms.'
  }
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithPrimaryActions: Story = {
  args: {
    primaryActions: (
      <>
        <Button variant="primary">Create item</Button>
        <Button variant="secondary">Import</Button>
      </>
    )
  }
};

export const WithSecondaryActions: Story = {
  args: {
    secondaryActions: <>Need help? Contact us!</>
  }
};

export const CustomHeadingLevel: Story = {
  args: {
    heading: <h3>Custom heading level</h3>,
    description: 'The heading slot accepts any heading element.'
  }
};
