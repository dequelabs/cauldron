import React from 'react';
import figma from '@figma/code-connect';
import {
  ActionMenu,
  ActionList,
  ActionListItem,
  Button,
  IconButton
} from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=3322-2487&m=dev';

// Button trigger
figma.connect(ActionMenu, FIGMA_URL, {
  variant: { Type: 'Button' },
  props: {
    // `bottom-start` is the React default; omit the `Left` mapping so the prop
    // is dropped from the snippet for the default alignment.
    placement: figma.enum('Alignment', {
      Right: 'bottom-end'
    }),
    // Scope the `Label` text lookup to the `Button` frame so it picks up the
    // trigger label (e.g. "Trigger") and not any `Label` layers inside the
    // menu's action items.
    triggerProps: figma.nestedProps('Button', {
      label: figma.textContent('Label')
    })
  },
  example: ({ placement, triggerProps }) => (
    <ActionMenu
      trigger={<Button>{triggerProps.label}</Button>}
      placement={placement}
    >
      <ActionList>
        <ActionListItem>Action one</ActionListItem>
        <ActionListItem>Action two</ActionListItem>
        <ActionListItem>Action three</ActionListItem>
      </ActionList>
    </ActionMenu>
  )
});

// Icon Button trigger
figma.connect(ActionMenu, FIGMA_URL, {
  variant: { Type: 'Icon Button' },
  props: {
    // `bottom-start` is the React default; omit the `Left` mapping so the prop
    // is dropped from the snippet for the default alignment.
    placement: figma.enum('Alignment', {
      Right: 'bottom-end'
    })
  },
  example: ({ placement }) => (
    <ActionMenu
      trigger={<IconButton icon="kabob" label="Menu" />}
      placement={placement}
    >
      <ActionList>
        <ActionListItem>Action one</ActionListItem>
        <ActionListItem>Action two</ActionListItem>
        <ActionListItem>Action three</ActionListItem>
      </ActionList>
    </ActionMenu>
  )
});
