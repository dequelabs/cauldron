import React, { useRef } from 'react';
import { mount } from 'enzyme';
import { TabPanel } from 'src/components/Tabs';

test('renders children', () => {
  const TabPanelwithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <TabPanel ref={tabPanel1}>
        <p>a simple paragraph</p>
        <p>a complicated paragraph</p>
      </TabPanel>
    );
  };

  const MountedTabPanel = mount(<TabPanelwithRef />);
  expect(MountedTabPanel.find('p')).toHaveLength(2);
});

test('renders className prop', () => {
  const TabPanelwithRef = () => {
    const tabPanel1 = useRef(null);
    return <TabPanel ref={tabPanel1} className="find--me" />;
  };
  const MountedTabPanel = mount(<TabPanelwithRef />);
  expect(MountedTabPanel.find('.find--me').exists()).toBe(true);
});

test('renders id prop', () => {
  const TabPanelwithRef = () => {
    const tabPanel1 = useRef(null);
    return <TabPanel ref={tabPanel1} id="I am a panelId" />;
  };
  const MountedTabPanel = mount(<TabPanelwithRef />);
  expect(MountedTabPanel.find('I am a panelId').exists());
});
