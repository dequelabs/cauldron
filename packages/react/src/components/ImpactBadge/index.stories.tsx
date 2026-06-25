import type { Meta, StoryObj } from '@storybook/react';
import ImpactBadge from './index';

const meta: Meta<typeof ImpactBadge> = {
  title: 'Components/ImpactBadge',
  component: ImpactBadge,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['critical', 'serious', 'moderate', 'minor']
    },
    label: { control: 'text' },
    size: {
      control: 'radio',
      options: ['default', 'small']
    }
  }
};

export default meta;

type Story = StoryObj<typeof ImpactBadge>;

export const Critical: Story = {
  args: { type: 'critical' }
};

export const Serious: Story = {
  args: { type: 'serious' }
};

export const Moderate: Story = {
  args: { type: 'moderate' }
};

export const Minor: Story = {
  args: { type: 'minor' }
};

export const Small: Story = {
  args: { type: 'critical', size: 'small' }
};
