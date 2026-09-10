import React from 'react';
import figma from '@figma/code-connect';
import { NavBar, NavItem } from '../../index';

const FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=82-137&m=dev';

figma.connect(NavBar, FIGMA_URL, {
  example: () => (
    <NavBar>
      <NavItem active>Home</NavItem>
      <NavItem active={false}>About</NavItem>
      <NavItem active={false}>Contact</NavItem>
    </NavBar>
  )
});
