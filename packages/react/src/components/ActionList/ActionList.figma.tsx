import React from 'react';
import figma from '@figma/code-connect';
import {
  ActionList,
  ActionListItem,
  ActionListGroup,
  ActionListLinkItem
} from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=3322-2422&m=dev';

// Standard action list item
figma.connect(ActionListItem, FIGMA_URL, {
  variant: { Element: 'Action list item' },
  props: {
    // `State=Disabled` is the only State value that maps to React's `disabled`
    // prop. Other State values (Hover/Focused/Resting/etc.) are purely visual
    // and return undefined so the prop is dropped from the snippet.
    disabled: figma.enum('State', { Disabled: true }),
    selected: figma.boolean('Checked', { true: true, false: undefined }),
    variant: figma.enum('Danger item', { True: 'danger' }),
    label: figma.textContent('Label'),
    // Description has a boolean toggle in Figma — when off, drop the prop.
    // Note: the text layer name is `Opitional description text` (typo preserved
    // intentionally — it must match the Figma layer exactly).
    description: figma.boolean('Description text', {
      true: figma.textContent('Opitional description text'),
      false: undefined
    })
  },
  example: ({ disabled, selected, variant, label, description }) => (
    <ActionList>
      <ActionListItem
        disabled={disabled}
        selected={selected}
        variant={variant}
        description={description}
      >
        {label}
      </ActionListItem>
    </ActionList>
  )
});

// Group label
figma.connect(ActionListGroup, FIGMA_URL, {
  variant: { Element: 'Group label' },
  props: {
    label: figma.textContent('Title')
  },
  example: ({ label }) => (
    <ActionList>
      <ActionListGroup label={label}>
        <ActionListItem>Action item</ActionListItem>
      </ActionListGroup>
    </ActionList>
  )
});

// Link item
figma.connect(ActionListLinkItem, FIGMA_URL, {
  variant: { Element: 'Link item' },
  props: {
    disabled: figma.enum('State', { Disabled: true }),
    label: figma.textContent('Text')
  },
  example: ({ disabled, label }) => (
    <ActionList>
      <ActionListLinkItem href="#" disabled={disabled}>
        {label}
      </ActionListLinkItem>
    </ActionList>
  )
});
