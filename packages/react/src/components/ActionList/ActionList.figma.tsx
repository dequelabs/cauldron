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
    disabled: figma.boolean('disabled', { true: true, false: undefined }),
    selected: figma.boolean('selected', { true: true, false: undefined }),
    variant: figma.enum('variant', { danger: 'danger' })
  },
  example: ({ disabled, selected, variant }) => (
    <ActionList>
      <ActionListItem
        disabled={disabled}
        selected={selected}
        variant={variant}
      >
        Action item
      </ActionListItem>
    </ActionList>
  )
});

// Group label
figma.connect(ActionListGroup, FIGMA_URL, {
  variant: { Element: 'Group label' },
  example: () => (
    <ActionList>
      <ActionListGroup label="Group label">
        <ActionListItem>Action item</ActionListItem>
      </ActionListGroup>
    </ActionList>
  )
});

// Link item
figma.connect(ActionListLinkItem, FIGMA_URL, {
  variant: { Element: 'Link item' },
  props: {
    disabled: figma.boolean('disabled', { true: true, false: undefined })
  },
  example: ({ disabled }) => (
    <ActionList>
      <ActionListLinkItem href="#" disabled={disabled}>
        Link item
      </ActionListLinkItem>
    </ActionList>
  )
});
