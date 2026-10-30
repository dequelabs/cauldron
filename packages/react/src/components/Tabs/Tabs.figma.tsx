import React, { useRef } from 'react';
import figma from '@figma/code-connect';
import { Tabs, Tab, TabPanel } from '../../index';

const TAB_FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=259-6525&m=dev';

const TAB_PANEL_FIGMA_URL =
  'https://www.figma.com/design/CEFVdiecqDjLSjhorjHUzI/Product-Foundations--Cauldron--Library?node-id=3409-1057&m=dev';

figma.connect(Tab, TAB_FIGMA_URL, {
  example: () => {
    const panelOneRef = useRef<HTMLDivElement>(null);
    const panelTwoRef = useRef<HTMLDivElement>(null);
    return (
      <>
        <Tabs aria-label="Example tabs">
          <Tab target={panelOneRef}>Tab 1</Tab>
          <Tab target={panelTwoRef}>Tab 2</Tab>
        </Tabs>
        <TabPanel ref={panelOneRef}>Panel 1 content</TabPanel>
        <TabPanel ref={panelTwoRef}>Panel 2 content</TabPanel>
      </>
    );
  }
});

figma.connect(TabPanel, TAB_PANEL_FIGMA_URL, {
  example: () => {
    const panelOneRef = useRef<HTMLDivElement>(null);
    const panelTwoRef = useRef<HTMLDivElement>(null);
    return (
      <>
        <Tabs aria-label="Example tabs">
          <Tab target={panelOneRef}>Tab 1</Tab>
          <Tab target={panelTwoRef}>Tab 2</Tab>
        </Tabs>
        <TabPanel ref={panelOneRef}>Panel 1 content</TabPanel>
        <TabPanel ref={panelTwoRef}>Panel 2 content</TabPanel>
      </>
    );
  }
});
