import type { Meta, StoryObj } from '@storybook/react';
import Code from './index';

const meta: Meta<typeof Code> = {
  title: 'Components/Code',
  component: Code,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: [undefined, 'javascript', 'css', 'html', 'yaml']
    },
    scrollable: { control: 'boolean' },
    allowCopy: { control: 'boolean' },
    label: { control: 'text' },
    children: { control: 'text' }
  }
};

export default meta;

type Story = StoryObj<typeof Code>;

export const Javascript: Story = {
  args: {
    language: 'javascript',
    children: `// here are some vars
var foo = true;
const number = 1234;
const string = "hello world";
const regex = /^anything$/i;`
  }
};

export const Html: Story = {
  args: {
    language: 'html',
    children: '<span class="foo">Hello world!</span>'
  }
};

export const Css: Story = {
  args: {
    language: 'css',
    children: `.foo,
#foo,
div[class="foo"] {
  color: green;
}`
  }
};

export const NoLanguage: Story = {
  args: {
    children: '$ npm install --save @deque/cauldron-react'
  }
};

export const Scrollable: Story = {
  args: {
    scrollable: true,
    children: `<div className="this element has a lot of classnames to ensure it will wrap at longer lengths">
  Hello World
</div>`
  }
};

export const AllowCopy: Story = {
  args: {
    allowCopy: true,
    label: 'Example Code Heading',
    children: `<div className="this element has a lot of classnames to ensure it will wrap at longer lengths">
  Hello World
</div>`
  }
};
