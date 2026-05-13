import React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { ThemeProvider } from '@deque/cauldron-react';
import '@deque/cauldron-react/cauldron.css';
import '../packages/styles';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: ['Components', ['*']]
      }
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'cauldron--theme-light',
        dark: 'cauldron--theme-dark'
      },
      defaultTheme: 'light'
    }),
    (Story, ctx) => (
      <ThemeProvider
        key={ctx.globals.theme || 'light'}
        initialTheme={ctx.globals.theme || 'light'}
      >
        <Story />
      </ThemeProvider>
    )
  ]
};

export default preview;
