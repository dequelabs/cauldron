import React from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab, TabPanel } from 'src/components/Tabs';
import axe from '../../../axe';

const [left, right, home, end, down] = [37, 39, 36, 35, 40];
const ariaLabel = 'I am a label';

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

test('renders children', () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>option 1</Tab>
      <Tab>option 2</Tab>
      <TabPanel>
        <p>Panel 1</p>
      </TabPanel>
      <TabPanel>
        <p>Panel 2</p>
      </TabPanel>
    </Tabs>
  );

  expect(MountedTabs.find('Tab')).toHaveLength(2);
  expect(MountedTabs.find('TabPanel')).toHaveLength(2);
});

test('only renders Tab or TabPanel', () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <li>option 1</li>
      <button>option 2</button>
      <div className="no-show-div">option 3</div>
    </Tabs>
  );
  expect(MountedTabs.find('li')).toHaveLength(0);
  expect(MountedTabs.find('button')).toHaveLength(0);
  expect(MountedTabs.find('.no-show-div')).toHaveLength(0);
});

test('renders thin prop', () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel} thin>
      <Tab>option 1</Tab>
    </Tabs>
  );
  expect(MountedTabs.find('Tabs--thin').exists());
});

test('renders className prop', () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel} className="find--me">
      <Tab>option 1</Tab>
    </Tabs>
  );
  expect(MountedTabs.find('find--me').exists());
});

test('renders label prop', () => {
  const MountedTabs = mount(
    <Tabs label="find-me">
      <Tab>option 1</Tab>
    </Tabs>
  );
  expect(MountedTabs.find('.Tablist').prop('aria-label')).toBe('find-me');
});

test('displays correct tabpanel when clicking a tab', async () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
      <TabPanel>TabPanel 1</TabPanel>
      <TabPanel>TabPanel 2</TabPanel>
      <TabPanel>TabPanel 3</TabPanel>
    </Tabs>
  );

  MountedTabs.find('Tab')
    .at(1)
    .simulate('click');
  await sleep();

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);

  MountedTabs.find('Tab')
    .at(2)
    .simulate('click');
  await sleep();

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
});

test('displays correct tabpanel when clicking a tab with a customized id', async () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel} id="customized-id">
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <TabPanel>TabPanel 1</TabPanel>
      <TabPanel>TabPanel 2</TabPanel>
    </Tabs>
  );

  MountedTabs.find('Tab')
    .at(1)
    .simulate('click');
  await sleep();

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
});

test('displays correct tabpanel when pressing left, right, home, or end keys', async () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
      <TabPanel>TabPanel 1</TabPanel>
      <TabPanel>TabPanel 2</TabPanel>
      <TabPanel>TabPanel 3</TabPanel>
    </Tabs>
  );

  MountedTabs.find('.Tablist').simulate('keydown', { which: right });
  await sleep();

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);

  MountedTabs.find('.Tablist').simulate('keydown', { which: left });
  await sleep();

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
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);

  MountedTabs.find('.Tablist').simulate('keydown', { which: end });
  await sleep();

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);

  MountedTabs.find('.Tablist').simulate('keydown', { which: home });
  await sleep();

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
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(true);
});

test('does not do anything when pressing keys other than left, right, home, or end', async () => {
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <TabPanel>TabPanel 1</TabPanel>
      <TabPanel>TabPanel 2</TabPanel>
    </Tabs>
  );

  MountedTabs.find('.Tablist').simulate('keydown', { which: down });
  await sleep();

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

test('returns no axe vialation', async () => {
  /* TabPanel is placed inside Tabs only for testing. In this way
  axe can examine Tab and TabPanel's attributes (such as aria-controls and aria-labelledby) with each other */
  const MountedTabs = mount(
    <Tabs label={ariaLabel}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <TabPanel />
      <TabPanel />
    </Tabs>
  );

  expect(await axe(MountedTabs.html())).toHaveNoViolations();
});
