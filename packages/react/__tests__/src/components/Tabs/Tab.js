import React from 'react';
import { mount } from 'enzyme';
import { Tab } from 'src/components/Tabs';

const initialValue = 0;

test('renders children', () => {
  const MountedTab = mount(
    <Tab value={initialValue} index={0}>
      <p>a simple paragraph</p>
    </Tab>
  );
  expect(MountedTab.find('p')).toHaveLength(1);
});

test('renders className Tab--active properly', () => {
  const TabWithFocus = mount(<Tab value={initialValue} index={0} />);
  const TabWithoutFocus = mount(<Tab value={initialValue} index={1} />);

  expect(TabWithFocus.find('.Tab--active')).toHaveLength(1);
  expect(TabWithoutFocus.find('.Tab--active')).toHaveLength(0);
});

test('renders tabIndex properly', async () => {
  const TabWithFocus = mount(<Tab value={initialValue} index={0} />);
  const TabWithoutFocus = mount(<Tab value={initialValue} index={1} />);

  expect(TabWithFocus.find('#tab-0').prop('tabIndex')).toEqual(0);
  expect(TabWithoutFocus.find('#tab-1').prop('tabIndex')).toEqual(-1);
});

test('renders aria-selected properly', async () => {
  const TabWithFocus = mount(<Tab value={initialValue} index={0} />);
  const TabWithoutFocus = mount(<Tab value={initialValue} index={1} />);

  expect(TabWithFocus.find('#tab-0').prop('aria-selected')).toEqual(true);
  expect(TabWithoutFocus.find('#tab-1').prop('aria-selected')).toEqual(false);
});

test('focuses the tab whose value matches its index', async () => {
  mount(
    <>
      <Tab value={initialValue} index={0} />
      <Tab value={initialValue} index={1} />
    </>
  );
  expect(document.activeElement.id).toEqual('tab-0');
});
