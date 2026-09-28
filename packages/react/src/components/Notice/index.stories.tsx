import type { Meta, StoryObj } from '@storybook/react';
import Notice from './index';

const meta: Meta<typeof Notice> = {
  title: 'Components/Notice',
  component: Notice,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['info', 'caution', 'danger', 'success']
    },
    variant: {
      control: 'radio',
      options: ['default', 'condensed']
    },
    title: { control: 'text' },
    children: { control: 'text' },
    icon: { control: 'text' }
  }
};

export default meta;

type Story = StoryObj<typeof Notice>;

export const Info: Story = {
  args: {
    type: 'info',
    title: 'New features available',
    children: 'Check out the latest release notes for details.'
  }
};

export const Caution: Story = {
  args: {
    type: 'caution',
    title: 'This action requires review',
    children: 'A team member must approve before it takes effect.'
  }
};

export const Danger: Story = {
  args: {
    type: 'danger',
    title: 'Something went wrong',
    children: 'Please try again, or contact support if the problem persists.'
  }
};

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Some action completed successfully',
    children: 'Example of the successfull description :)'
  }
};

export const Condensed: Story = {
  args: {
    type: 'info',
    variant: 'condensed',
    title: 'Saved as draft'
  }
};
