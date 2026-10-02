import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from './index';
import Button from '../Button';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    overline: { control: 'text' },
    description: { control: 'text' }
  }
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    heading: 'Page title'
  }
};

export const WithDescription: Story = {
  args: {
    heading: 'Page title',
    description: 'A short summary of what this page is about.'
  }
};

export const WithOverline: Story = {
  args: {
    overline: 'Settings',
    heading: 'Account preferences',
    description: 'Manage your profile, notifications, and security.'
  }
};

export const WithActions: Story = {
  args: {
    overline: 'Settings',
    heading: 'Account preferences',
    description: 'Manage your profile, notifications, and security.',
    children: (
      <>
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
      </>
    )
  }
};

export const CustomHeadingLevel: Story = {
  args: {
    heading: <h2>Section title</h2>,
    description: 'Use a custom heading element to fit the page structure.'
  }
};
