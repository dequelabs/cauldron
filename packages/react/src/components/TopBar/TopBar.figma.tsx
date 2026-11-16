import React from 'react';
import figma from '@figma/code-connect';
import { TopBar, TopBarItem, TopBarTrigger } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=515-2774&m=dev';

figma.connect(TopBar, FIGMA_URL, {
  example: () => (
    <TopBar>
      <TopBarItem>Home</TopBarItem>
      <TopBarItem>About</TopBarItem>
      <TopBarTrigger>Menu</TopBarTrigger>
    </TopBar>
  )
});
