import type { Meta, StoryObj } from '@storybook/react';
import Icon from './index';
import { iconTypes } from './types';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: iconTypes
    },
    label: { control: 'text' }
  },
  args: {
    type: 'star'
  }
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    type: 'star',
    label: 'Star icon'
  }
};

export const Decorative: Story = {
  args: {
    type: 'check-circle'
  }
};
