import React from 'react';
import figma from '@figma/code-connect';
import { IconButton } from '@deque/cauldron-react';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=17-4272&m=dev';

figma.connect(IconButton, FIGMA_URL, {
  props: {
    // `Icon` is exposed from a nested instance shown as `_Icon Type` in the
    // properties panel. `figma.nestedProps` reaches into that child layer so
    // we can grab its `Icon` enum value as a string.
    iconProps: figma.nestedProps('_Icon Type', {
      name: figma.string('Icon')
    }),
    // `secondary` is the default — omitting it from the mapping makes
    // figma.enum return undefined for that variant, which the snippet
    // renderer then drops from the example.
    variant: figma.enum('variant', {
      primary: 'primary',
      tertiary: 'tertiary'
    }),
    large: figma.boolean('large', { true: true, false: undefined }),
    disabled: figma.boolean('disabled', { true: true, false: undefined })
  },
  example: ({ iconProps, variant, large, disabled }) => (
    <IconButton
      icon={iconProps.name}
      variant={variant}
      large={large}
      disabled={disabled}
    />
  )
});
