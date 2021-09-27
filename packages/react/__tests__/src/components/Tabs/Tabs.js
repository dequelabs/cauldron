import React from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab, TabPanel } from 'src/components/Tabs';
import axe from '../../../axe';

const initialValue = 0;
const initialHandleChange = () => {};
const [left, right, home, end, down] = [37, 39, 36, 35, 40];

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

test('renders children', () => {
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={initialHandleChange}>
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
    <Tabs value={initialValue} handleChange={initialHandleChange}>
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
    <Tabs value={initialValue} handleChange={initialHandleChange} thin>
      <Tab>option 1</Tab>
    </Tabs>
  );
  expect(MountedTabs.find('Tabs--thin').exists());
});

test('renders className prop', () => {
  const MountedTabs = mount(
    <Tabs
      value={initialValue}
      handleChange={initialHandleChange}
      className="find--me"
    >
      <Tab>option 1</Tab>
    </Tabs>
  );
  expect(MountedTabs.find('find--me').exists());
});

test('renders ariaLabelForTablist prop', () => {
  const MountedTabs = mount(
    <Tabs
      value={initialValue}
      handleChange={initialHandleChange}
      ariaLabelForTablist="find-me"
    >
      <Tab>option 1</Tab>
    </Tabs>
  );
  expect(MountedTabs.find('.Tablist').prop('aria-label')).toBe('find-me');
});

test('calls handleChange when clicking a tab', async () => {
  const handleChangeSpy = jest.fn();
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={handleChangeSpy}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
    </Tabs>
  );

  expect(handleChangeSpy).toBeCalledTimes(0);
  MountedTabs.find('Tab')
    .at(0)
    .simulate('click');
  await sleep();

  expect(handleChangeSpy).toBeCalledTimes(1);
  expect(handleChangeSpy).toBeCalledWith(0);

  MountedTabs.find('Tab')
    .at(1)
    .simulate('click');
  await sleep();

  expect(handleChangeSpy).toBeCalledTimes(2);
  expect(handleChangeSpy).toBeCalledWith(1);
});

test('calls handleChange when pressing left, right, home, or end keys', async () => {
  const handleChangeSpy = jest.fn();
  const chosenValue = 1;
  const MountedTabs = mount(
    <Tabs value={chosenValue} handleChange={handleChangeSpy}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    </Tabs>
  );

  expect(handleChangeSpy).toBeCalledTimes(0);

  MountedTabs.find('Tab')
    .at(0)
    .simulate('keydown', { which: left });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(1);
  expect(handleChangeSpy).toBeCalledWith(0);

  MountedTabs.find('Tab')
    .at(0)
    .simulate('keydown', { which: right });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(2);
  expect(handleChangeSpy).toBeCalledWith(1);

  MountedTabs.find('Tab')
    .at(0)
    .simulate('keydown', { which: home });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(3);
  expect(handleChangeSpy).toBeCalledWith(0);

  MountedTabs.find('Tab')
    .at(0)
    .simulate('keydown', { which: end });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(4);
  expect(handleChangeSpy).toBeCalledWith(2);
});

test('does not call handleChange when pressing keys other than left, right, home, or end', async () => {
  const handleChangeSpy = jest.fn();
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={handleChangeSpy}>
      <Tab>Tab 1</Tab>
    </Tabs>
  );

  expect(handleChangeSpy).toBeCalledTimes(0);

  MountedTabs.find('Tab').simulate('keydown', { which: down });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(0);
});

test('returns no axe vialation', async () => {
  /* TabPanel is placed inside Tabs only for testing. In this way
  axe can examine Tab and TabPanel's attributes (such as aria-controls and aria-labelledby) with each other */
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={initialHandleChange}>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <TabPanel />
      <TabPanel />
    </Tabs>
  );

  expect(await axe(MountedTabs.html())).toHaveNoViolations();
});
