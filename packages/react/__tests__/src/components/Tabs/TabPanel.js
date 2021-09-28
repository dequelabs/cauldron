import React from 'react';
import { mount } from 'enzyme';
import Tabs, { TabPanel } from 'src/components/Tabs';

const ariaLabel = 'I am a label';

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

test('handles TabPanel--hidden properly', () => {
  const MountedTabs = mount(
    <Tabs aria-label={ariaLabel}>
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
