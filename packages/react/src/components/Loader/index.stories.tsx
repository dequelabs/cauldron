import type { Meta, StoryObj } from '@storybook/react';
import Loader from './index';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  }
};

export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Loading content' }
};
