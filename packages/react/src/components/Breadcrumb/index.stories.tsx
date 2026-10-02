import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb, { BreadcrumbLink, BreadcrumbItem } from './index';
import Icon from '../Icon';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'text' },
    'aria-label': { control: 'text' }
  },
  args: {
    'aria-label': 'Breadcrumb'
  }
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbLink href="#/one">One</BreadcrumbLink>
      <BreadcrumbLink href="#/two">Two</BreadcrumbLink>
      <BreadcrumbLink href="#/three">Three</BreadcrumbLink>
      <BreadcrumbItem aria-current="page">Four</BreadcrumbItem>
    </Breadcrumb>
  )
};

export const CustomSeparator: Story = {
  args: {
    separator: '›'
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbLink href="#/one">One</BreadcrumbLink>
      <BreadcrumbLink href="#/two">Two</BreadcrumbLink>
      <BreadcrumbLink href="#/three">Three</BreadcrumbLink>
      <BreadcrumbItem aria-current="page">Four</BreadcrumbItem>
    </Breadcrumb>
  )
};

export const IconSeparator: Story = {
  argTypes: {
    separator: { table: { disable: true } }
  },
  render: (args) => (
    <Breadcrumb {...args} separator={<Icon type="chevron-double-right" />}>
      <BreadcrumbLink href="#/one">One</BreadcrumbLink>
      <BreadcrumbLink href="#/two">Two</BreadcrumbLink>
      <BreadcrumbItem aria-current="page">Three</BreadcrumbItem>
    </Breadcrumb>
  )
};
