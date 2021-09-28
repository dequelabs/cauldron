import React from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab } from 'src/components/Tabs';

const ariaLabel = 'I am a label';

test('renders children', () => {
  const MountedTab = mount(
    <Tab>
      <p>a simple paragraph</p>
    </Tab>
  );
  expect(MountedTab.find('p')).toHaveLength(1);
});

test('renders className Tab--active properly', () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </Tabs>
  );

  expect(
    MountedTabs.find('Tab')
      .at(0)
      .find('.Tab--active')
      .exists()
  );
  expect(
    MountedTabs.find('Tab')
      .at(1)
      .find('.Tab--active')
  ).toHaveLength(0);
});

test('renders tabIndex properly', async () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </Tabs>
  );

  expect(
    MountedTabs.find('Tab')
      .at(0)
      .prop('tabIndex')
  ).toEqual(0);
  expect(
    MountedTabs.find('Tab')
      .at(1)
      .prop('tabIndex')
  ).toEqual(-1);
});

test('renders aria-selected properly', async () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </Tabs>
  );

  expect(
    MountedTabs.find('Tab')
      .at(0)
      .prop('aria-selected')
  ).toEqual(true);
  expect(
    MountedTabs.find('Tab')
      .at(1)
      .prop('aria-selected')
  ).toEqual(false);
});
