import React from 'react';
import figma from '@figma/code-connect';
import { Icon } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=8-2849&m=dev';

figma.connect(Icon, FIGMA_URL, {
  props: {
    // The icon glyph itself comes from a nested `_Icon Type` instance (same
    // pattern as IconButton), exposing its `Icon` enum value as a string.
    iconProps: figma.nestedProps('_Icon Type', {
      name: figma.string('Icon')
    })
  },
  // No `as IconType` cast — Code Connect's parser bakes the entire JSX
  // expression text into the prop placeholder, so a cast here produces
  // `__PROP__("iconProps.name as IconType")` which Figma's renderer can't
  // resolve. The .figma.tsx file is excluded from typecheck, so a plain
  // `iconProps.name` is fine.
  example: ({ iconProps }) => <Icon type={iconProps.name} />
});
