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
    placement: figma.enum('Alignment', {
      Left: 'bottom-start',
      Right: 'bottom-end'
    })
  },
  example: ({ placement }) => (
    <ActionMenu trigger={<Button>Menu</Button>} placement={placement}>
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
    placement: figma.enum('Alignment', {
      Left: 'bottom-start',
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
