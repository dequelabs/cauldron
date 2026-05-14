import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    id: 'checkbox',
    label: 'Checkbox'
  },
  argTypes: {
    label: { control: 'text' },
    labelDescription: { control: 'text' },
    error: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed', table: { disable: true } },
    checkboxRef: { table: { disable: true } },
    customIcon: { table: { disable: true } }
  }
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { id: 'checkbox-default', label: 'Send me marketing emails' }
};

export const Checked: Story = {
  args: { id: 'checkbox-checked', label: 'Subscribed', checked: true }
};

export const Indeterminate: Story = {
  args: {
    id: 'checkbox-indeterminate',
    label: 'Select all',
    indeterminate: true
  }
};

export const WithDescription: Story = {
  args: {
    id: 'checkbox-described',
    label: 'Enable beta features',
    labelDescription: 'Beta features may change or be removed without notice.'
  }
};

export const WithError: Story = {
  args: {
    id: 'checkbox-error',
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue.'
  }
};

export const Disabled: Story = {
  args: { id: 'checkbox-disabled', label: 'Disabled', disabled: true }
};
