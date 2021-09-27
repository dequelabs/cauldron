import React from 'react';
import { mount } from 'enzyme';
import Tabs, { TabPanel } from 'src/components/Tabs';

const initialHandleChange = () => {};

test('renders children', () => {
  const MountedTabPanel = mount(
    <TabPanel>
      <p>a simple paragraph</p>
      <p>a complicated paragraph</p>
    </TabPanel>
  );
  expect(MountedTabPanel.find('p')).toHaveLength(2);
});

test('renders className props', () => {
  const MountedTabPanel = mount(<TabPanel className="find--me" />);
  expect(MountedTabPanel.find('find--me').exists());
});

test('displays TabPanel when value and index match', async () => {
  const MountedTabs = mount(
    <Tabs value={0} handleChange={initialHandleChange}>
      <TabPanel />
    </Tabs>
  );
  expect(MountedTabs.find('.TabPanel--hidden').exists()).toBe(false);
});

test('hides TabPanel when value and index do not match', () => {
  const MountedTabs = mount(
    <Tabs value={1} handleChange={initialHandleChange}>
      <TabPanel />
    </Tabs>
  );
  expect(MountedTabs.find('.TabPanel--hidden').exists()).toBe(true);
});
