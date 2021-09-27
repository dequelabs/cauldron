import React from 'react';
import { mount } from 'enzyme';
import { TabPanel } from 'src/components/Tabs';

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

test('displays TabPanel according to whether value and index match', async () => {
  const MountedTabPanel = mount(<TabPanel />);
  expect(MountedTabPanel.find('.TabPanel--hidden').exists()).toBe(false);
});

test('hides TabPanel according to whether value and index match', () => {
  const MountedTabPanel = mount(<TabPanel />);
  expect(MountedTabPanel.find('.TabPanel--hidden').exists());
});
