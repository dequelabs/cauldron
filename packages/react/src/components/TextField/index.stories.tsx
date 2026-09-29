import type { Meta, StoryObj } from '@storybook/react';
import TextField from './index';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Label'
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    multiline: { control: 'boolean' },
    onChange: { action: 'changed', table: { disable: true } },
    fieldRef: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { label: 'Name', placeholder: 'Jane Doe' }
};

export const WithDescription: Story = {
  args: {
    label: 'Email',
    description: "We'll never share your email.",
    placeholder: 'jane@example.com'
  }
};

export const Required: Story = {
  args: { label: 'Username', required: true }
};

export const WithError: Story = {
  args: {
    label: 'Password',
    error: 'Password must be at least 8 characters.'
  }
};

export const Multiline: Story = {
  args: {
    label: 'Bio',
    multiline: true,
    placeholder: 'Tell us about yourself…'
  }
};

export const Disabled: Story = {
  args: { label: 'Read only', disabled: true, defaultValue: 'Cannot edit' }
};
