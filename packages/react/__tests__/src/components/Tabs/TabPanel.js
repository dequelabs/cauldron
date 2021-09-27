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

test('handles TabPanel--hidden properly', async () => {
  const MountedTabs = mount(
    <Tabs value={0} handleChange={initialHandleChange}>
      <TabPanel />
      <TabPanel />
    </Tabs>
  );

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
});
