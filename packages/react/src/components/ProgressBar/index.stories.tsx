import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './index';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Progress'
  },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    progressMin: { control: 'number' },
    progressMax: { control: 'number' },
    thin: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { progress: 40 }
};

export const Complete: Story = {
  args: { progress: 100 }
};

export const Thin: Story = {
  args: { progress: 60, thin: true }
};
