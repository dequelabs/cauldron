import type { Meta, StoryObj } from '@storybook/react';
import Line from './index';

const meta: Meta<typeof Line> = {
  title: 'Components/Line',
  component: Line,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Line>;

export const Default: Story = {};
