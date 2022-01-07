import React, { useRef } from 'react';
import {
  TwoColumnPanel,
  ColumnLeft,
  ColumnRight,
  ColumnHeader,
  Tabs,
  Tab,
  TabPanel
} from '@deque/cauldron-react/';

function TwoColumnPanelDemo() {
  const one = useRef();
  const two = useRef();
  const three = useRef();

  const collapsedOne = useRef();
  const collapsedTwo = useRef();
  const collapsedThree = useRef();

  return (
    <div className="twocolumnpanel-demo">
      <h1>Two Column Panel</h1>

      <TwoColumnPanel>
        <ColumnLeft>
          <ColumnHeader>Sidebar label</ColumnHeader>
          <Tabs orientation="vertical">
            <Tab target={one}>
              One
              <em>Short description of one</em>
            </Tab>
            <Tab target={two}>
              Two
              <em>Short description of two</em>
            </Tab>
            <Tab target={three}>
              Three
              <em>Short description of three</em>
            </Tab>
          </Tabs>
        </ColumnLeft>
        <ColumnRight>
          <ColumnHeader>Header Label</ColumnHeader>
          <TabPanel ref={one}>Tab Contents One</TabPanel>
          <TabPanel ref={two}>Tab Contents Two</TabPanel>
          <TabPanel ref={three}>Tab Contents Three</TabPanel>
        </ColumnRight>
      </TwoColumnPanel>

      <h2>Collapsed</h2>

      <div style={{ width: '400px' }}>
        <TwoColumnPanel collapsed>
          <ColumnLeft>
            <ColumnHeader>Tabs</ColumnHeader>
            <Tabs orientation="vertical">
              <Tab target={collapsedOne}>
                One
                <em>Short description of one</em>
              </Tab>
              <Tab target={collapsedTwo}>
                Two
                <em>Short description of two</em>
              </Tab>
              <Tab target={collapsedThree}>
                Three
                <em>Short description of three</em>
              </Tab>
            </Tabs>
          </ColumnLeft>
          <ColumnRight>
            <ColumnHeader>Stuff</ColumnHeader>
            <TabPanel ref={collapsedOne}>Tab Contents One</TabPanel>
            <TabPanel ref={collapsedTwo}>Tab Contents Two</TabPanel>
            <TabPanel ref={collapsedThree}>Tab Contents Three</TabPanel>
          </ColumnRight>
        </TwoColumnPanel>
      </div>
    </div>
  );
}

export default TwoColumnPanelDemo;
