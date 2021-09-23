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
      <li>option 1</li>
      <li>option 2</li>
    </Tabs>
  );
  expect(MountedTabs.find('li')).toHaveLength(2);
});

test('renders thin prop', () => {
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={initialHandleChange} thin>
      <li>option 1</li>
    </Tabs>
  );
  expect(MountedTabs.find('Tabs--thin').exists());
});

test('renders className props', () => {
  const MountedTabs = mount(
    <Tabs
      value={initialValue}
      handleChange={initialHandleChange}
      className="find--me"
    >
      <li>option 1</li>
    </Tabs>
  );
  expect(MountedTabs.find('find--me').exists());
});

test('calls handleChange when clicking a tab', async () => {
  const handleChangeSpy = jest.fn();
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={handleChangeSpy}>
      <Tab label="Tab 1" index={0} value={initialValue}></Tab>
      <Tab label="Tab 2" index={1} value={initialValue}></Tab>
    </Tabs>
  );

  expect(handleChangeSpy).toBeCalledTimes(0);

  MountedTabs.find('#tab-0').simulate('click');
  await sleep();

  expect(handleChangeSpy).toBeCalledTimes(1);
  expect(handleChangeSpy).toBeCalledWith(0);

  MountedTabs.find('#tab-1').simulate('click');
  await sleep();

  expect(handleChangeSpy).toBeCalledTimes(2);
  expect(handleChangeSpy).toBeCalledWith(1);
});

test('calls handleChange when pressing left, right, home, or end keys', async () => {
  const handleChangeSpy = jest.fn();
  const chosenValue = 1;
  const MountedTabs = mount(
    <Tabs value={chosenValue} handleChange={handleChangeSpy}>
      <Tab label="Tab 1" index={0} value={chosenValue}></Tab>
      <Tab label="Tab 2" index={1} value={chosenValue}></Tab>
      <Tab label="Tab 3" index={2} value={chosenValue}></Tab>
    </Tabs>
  );

  expect(handleChangeSpy).toBeCalledTimes(0);

  MountedTabs.find('#tab-0').simulate('keydown', { which: left });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(1);
  expect(handleChangeSpy).toBeCalledWith(0);

  MountedTabs.find('#tab-0').simulate('keydown', { which: right });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(2);
  expect(handleChangeSpy).toBeCalledWith(1);

  MountedTabs.find('#tab-0').simulate('keydown', { which: home });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(3);
  expect(handleChangeSpy).toBeCalledWith(0);

  MountedTabs.find('#tab-0').simulate('keydown', { which: end });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(4);
  expect(handleChangeSpy).toBeCalledWith(2);
});

test('does not call handleChange when pressing keys other than left, right, home, or end', async () => {
  const handleChangeSpy = jest.fn();
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={handleChangeSpy}>
      <Tab label="Tab 1" index={0} value={initialValue}></Tab>
    </Tabs>
  );

  expect(handleChangeSpy).toBeCalledTimes(0);

  MountedTabs.find('.Tab').simulate('keydown', { which: down });
  await sleep();
  expect(handleChangeSpy).toBeCalledTimes(0);
});

test('returns no axe vialation', async () => {
  /* TabPanel is placed inside Tabs only for testing. In this way
  axe can examine Tab and TabPanel's attributes (such as aria-controls and aria-labelledby) with each other */
  const MountedTabs = mount(
    <Tabs value={initialValue} handleChange={initialHandleChange}>
      <Tab label="Tab 1" index={0} value={initialValue}></Tab>
      <Tab label="Tab 2" index={1} value={initialValue}></Tab>
      <TabPanel value={initialValue} index={0} />
      <TabPanel value={initialValue} index={1} />
    </Tabs>
  );

  expect(await axe(MountedTabs.html())).toHaveNoViolations();
});
