import React, { useRef } from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab, TabPanel } from 'src/components/Tabs';
import axe from '../../../axe';
import { act } from 'react-dom/test-utils';

const ariaLabel = 'I am a label';

const update = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();
  });
};

test('mounts without error', () => {
  expect(() =>
    mount(
      <Tabs aria-label={ariaLabel}>
        <div />
      </Tabs>
    )
  ).not.toThrow();
});

test('renders children', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={tabPanel1}>option 1</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  expect(MountedTabs.find('Tab')).toHaveLength(1);
});

test('only renders Tab', () => {
  const MountedTabs = mount(
    <Tabs aria-label={ariaLabel}>
      <li>option 1</li>
      <button>option 2</button>
      <div className="no-show-div">option 3</div>
    </Tabs>
  );
  expect(MountedTabs.find('li')).toHaveLength(0);
  expect(MountedTabs.find('button')).toHaveLength(0);
  expect(MountedTabs.find('.no-show-div')).toHaveLength(0);
});

test('renders thin prop', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} thin>
          <Tab target={tabPanel1}>option 1</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);
  expect(MountedTabs.find('Tabs--thin').exists());
});

test('renders className prop', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} className="find--me">
          <Tab target={tabPanel1}>option 1</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await MountedTabs.update();

  expect(MountedTabs.find('find--me').exists());
});

test('renders aria-label prop', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <>
        <Tabs aria-label="find-me">
          <Tab target={tabPanel1}>option 1</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);
  expect(MountedTabs.find('.Tablist').prop('aria-label')).toBe('find-me');
});

test('renders aria-labelledby prop', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    return (
      <>
        <Tabs aria-labelledby="find-me">
          <Tab target={tabPanel1}>option 1</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);
  expect(MountedTabs.find('.Tablist').prop('aria-labelledby')).toBe('find-me');
});

test('displays correct tabpanel when clicking a tab', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    const tabPanel3 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={tabPanel1}>option 1</Tab>
          <Tab target={tabPanel2}>option 2</Tab>
          <Tab target={tabPanel3}>option 3</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel panelref={tabPanel2}>
          <p>Panel 2</p>
        </TabPanel>
        <TabPanel panelref={tabPanel3}>
          <p>Panel 3</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  MountedTabs.find('Tab')
    .at(1)
    .simulate('click');
  await update(MountedTabs);

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  );
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
  );

  MountedTabs.find('Tab')
    .at(2)
    .simulate('click');
  await update(MountedTabs);

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
});

test('displays correct tabpanel when clicking a tab with a customized id', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);

    return (
      <>
        <Tabs aria-label={ariaLabel} id="customized-id">
          <Tab target={tabPanel1}>option 1</Tab>
          <Tab target={tabPanel2}>option 2</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel panelref={tabPanel2}>
          <p>Panel 2</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  MountedTabs.find('Tab')
    .at(1)
    .simulate('click');
  await update(MountedTabs);

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);
});

test('displays correct tabpanel when pressing left, right, home, or end keys', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    const tabPanel3 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={tabPanel1}>option 1</Tab>
          <Tab target={tabPanel2}>option 2</Tab>
          <Tab target={tabPanel3}>option 3</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel panelref={tabPanel2}>
          <p>Panel 2</p>
        </TabPanel>
        <TabPanel panelref={tabPanel3}>
          <p>Panel 3</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'ArrowLeft' });
  await update(MountedTabs);

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'ArrowRight' });
  await update(MountedTabs);

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
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  );

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'End' });
  await update(MountedTabs);

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'Home' });
  await update(MountedTabs);

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
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(2)
      .find('.TabPanel--hidden')
      .exists()
  );
});

test('does not do anything when pressing keys other than left, right, home, or end', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={tabPanel1}>option 1</Tab>
          <Tab target={tabPanel2}>option 2</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel panelref={tabPanel2}>
          <p>Panel 2</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'ArrowDown' });
  await update(MountedTabs);

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
  );
});

test('displays correct tabpanel when pressing left, right, home, or end keys with customized id', async () => {
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel} id="I am a customized-id">
          <Tab target={tabPanel1}>option 1</Tab>
          <Tab target={tabPanel2}>option 2</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel panelref={tabPanel2}>
          <p>Panel 2</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'ArrowRight' });
  await update(MountedTabs);

  expect(
    MountedTabs.find('TabPanel')
      .at(0)
      .find('.TabPanel--hidden')
      .exists()
  );
  expect(
    MountedTabs.find('TabPanel')
      .at(1)
      .find('.TabPanel--hidden')
      .exists()
  ).toBe(false);

  MountedTabs.find('.Tablist').simulate('keydown', { key: 'ArrowLeft' });
  await update(MountedTabs);

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
  );
});

test('returns no axe vialation', async () => {
  /* TabPanel is placed inside Tabs only for testing. In this way
  axe can examine Tab and TabPanel's attributes (such as aria-controls and aria-labelledby) with each other */
  const TabswithRef = () => {
    const tabPanel1 = useRef(null);
    const tabPanel2 = useRef(null);
    return (
      <>
        <Tabs aria-label={ariaLabel}>
          <Tab target={tabPanel1}>option 1</Tab>
          <Tab target={tabPanel2}>option 2</Tab>
        </Tabs>
        <TabPanel panelref={tabPanel1}>
          <p>Panel 1</p>
        </TabPanel>
        <TabPanel panelref={tabPanel2}>
          <p>Panel 2</p>
        </TabPanel>
      </>
    );
  };

  const MountedTabs = mount(<TabswithRef />);
  await update(MountedTabs);

  expect(await axe(MountedTabs.html())).toHaveNoViolations();
});
