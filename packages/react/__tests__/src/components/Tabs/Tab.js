import React, { useRef } from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab } from 'src/components/Tabs';

const ariaLabel = 'I am a label';

test('renders children', () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <Tab targetref={tabPanel1} id={'I am a tabId'}>
        <p>a simple paragraph</p>
      </Tab>
    );
  };
  const MountedTab = mount(<TabswithRef />);
  expect(MountedTab.find('p')).toHaveLength(1);
});

test('renders id prop properly', () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <Tab targetref={tabPanel1} id={'I am a tabId'}>
        option 1
      </Tab>
    );
  };

  const MountedTab = mount(<TabswithRef />);
  expect(MountedTab.find('Tab').prop('id')).toEqual('I am a tabId');
});

test('renders className Tab--active properly', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab targetref={tabPanel1}>option 1</Tab>
          <Tab targetref={tabPanel2}>option 2</Tab>
        </Tabs>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await MountedTabs.update();

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

test('renders aria-selected properly', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} initialActiveIndex={1}>
          <Tab targetref={tabPanel1}>option 1</Tab>
          <Tab targetref={tabPanel2}>option 2</Tab>
        </Tabs>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await MountedTabs.update();

  expect(
    MountedTabs.find('Tab')
      .at(1)
      .prop('aria-selected')
  ).toEqual(true);
  expect(
    MountedTabs.find('Tab')
      .at(0)
      .prop('aria-selected')
  ).toEqual(false);
});
