import React from 'react';
import { mount } from 'enzyme';
import {
  default as Listbox,
  ListboxGroup,
  ListboxOption
} from 'src/components/Listbox';

// Utility function for checking for active element for the given li index of a Listbox component
const listItemIsActive = (wrapper) => (index) => {
  const ul = wrapper.find(Listbox).childAt(0);
  const options = ul.find('li');
  const activeOption = options.at(index);
  expect(ul.prop('aria-activedescendant')).toBeTruthy();
  expect(ul.find('ul').prop('aria-activedescendant')).toEqual(
    activeOption.prop('id')
  );
  expect(activeOption.hasClass('ListboxOption--active')).toBeTruthy();
  options.forEach(
    (option, index) =>
      index !== index &&
      expect(option).hasClass('ListboxOption--active').toBeFalsy()
  );
};

const simulateKeydown = (wrapper, key) => () => {
  wrapper.simulate('keydown', { key });
  wrapper.update();
};

test('should render listbox with options', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(wrapper.find(Listbox).exists()).toBeTruthy();
  expect(wrapper.find(ListboxOption).at(0).text()).toEqual('Apple');
  expect(wrapper.find(ListboxOption).at(1).text()).toEqual('Banana');
  expect(wrapper.find(ListboxOption).at(2).text()).toEqual('Cantaloupe');
});

test('should render listbox with grouped options', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxGroup label="Fruit">
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
      <ListboxGroup label="Vegetables">
        <ListboxOption>Artichoke</ListboxOption>
        <ListboxOption>Broccoli</ListboxOption>
        <ListboxOption>Carrots</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  const group1 = wrapper.find(ListboxGroup).at(0);
  const group2 = wrapper.find(ListboxGroup).at(1);

  expect(wrapper.find(Listbox).exists()).toBeTruthy();
  expect(group1.exists()).toBeTruthy();
  expect(group2.exists()).toBeTruthy();
  expect(group1.find('ul').prop('role')).toEqual('group');
  expect(group2.find('ul').prop('role')).toEqual('group');
  expect(group1.find(ListboxOption).at(0).text()).toEqual('Apple');
  expect(group1.find(ListboxOption).at(1).text()).toEqual('Banana');
  expect(group1.find(ListboxOption).at(2).text()).toEqual('Cantaloupe');
  expect(group2.find(ListboxOption).at(0).text()).toEqual('Artichoke');
  expect(group2.find(ListboxOption).at(1).text()).toEqual('Broccoli');
  expect(group2.find(ListboxOption).at(2).text()).toEqual('Carrots');
});

test('should set accessible name of grouped options', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxGroup label="Fruit">
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  const group = wrapper.find(ListboxGroup).childAt(0);
  const groupLabel = group.find('li[role="presentation"]');

  expect(groupLabel.text()).toEqual('Fruit');
  expect(groupLabel.prop('id')).not.toBeFalsy();
  expect(group.prop('aria-labelledby')).toEqual(groupLabel.prop('id'));
});

test('should set the first non-disabled option as active on focus', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption disabled>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  wrapper.find(Listbox).simulate('focus');
  wrapper.update();
  const listbox = wrapper.find('ul');
  const option = wrapper.find('li').at(1);

  expect(option.hasClass('ListboxOption--active')).toBeTruthy();
  expect(listbox.prop('aria-activedescendant')).toEqual(option.prop('id'));
});

test('should set selected value with "value" prop when listbox option only has text label', () => {
  const wrapper = mount(
    <Listbox value="Banana">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  wrapper.update();
  const li = wrapper.find(ListboxOption).children();

  expect(li.at(0).prop('aria-selected')).toBeFalsy();
  expect(li.at(1).prop('aria-selected')).toEqual(true);
  expect(li.at(2).prop('aria-selected')).toBeFalsy();
});

test('should set selected value with "defaultValue" prop when listbox option only has text label', () => {
  const wrapper = mount(
    <Listbox defaultValue="Banana">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  wrapper.update();
  const li = wrapper.find(ListboxOption).children();

  expect(li.at(0).prop('aria-selected')).toBeFalsy();
  expect(li.at(1).prop('aria-selected')).toEqual(true);
  expect(li.at(2).prop('aria-selected')).toBeFalsy();
});

test('should set selected value with "value" prop when listbox option uses value prop', () => {
  const wrapper = mount(
    <Listbox value="b">
      <ListboxOption value="a">Apple</ListboxOption>
      <ListboxOption value="b">Banana</ListboxOption>
      <ListboxOption value="c">Cantaloupe</ListboxOption>
    </Listbox>
  );

  wrapper.update();
  const li = wrapper.find(ListboxOption).children();

  expect(li.at(0).prop('aria-selected')).toBeFalsy();
  expect(li.at(1).prop('aria-selected')).toEqual(true);
  expect(li.at(2).prop('aria-selected')).toBeFalsy();
});

test('should set selected value with "value" prop when listbox option uses defaultValue prop', () => {
  const wrapper = mount(
    <Listbox defaultValue="b">
      <ListboxOption value="a">Apple</ListboxOption>
      <ListboxOption value="b">Banana</ListboxOption>
      <ListboxOption value="c">Cantaloupe</ListboxOption>
    </Listbox>
  );

  wrapper.update();
  const li = wrapper.find(ListboxOption).children();

  expect(li.at(0).prop('aria-selected')).toBeFalsy();
  expect(li.at(1).prop('aria-selected')).toEqual(true);
  expect(li.at(2).prop('aria-selected')).toBeFalsy();
});

test('should handle ↓ keypress', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateDownKeypress = simulateKeydown(listbox, 'ArrowDown');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  // skips disabled option
  simulateDownKeypress();
  assertListItemIsActive(2);
  simulateDownKeypress();
  assertListItemIsActive(3);
});

test.skip('should handle ↑ keypress', () => {
  const wrapper = mount(
    <Listbox defaultValue="Dragon Fruit">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateUpKeypress = simulateKeydown(wrapper, 'ArrowUp');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  simulateUpKeypress();
  assertListItemIsActive(2);
  simulateUpKeypress();
  // skips disabled option
  assertListItemIsActive(0);
});

test('should keep active element bound to first/last when navigation is set to "bound"', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateUpKeypress = simulateKeydown(wrapper, 'ArrowUp');
  const simulateDownKeypress = simulateKeydown(wrapper, 'ArrowDown');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  simulateUpKeypress();
  assertListItemIsActive(0);
  simulateDownKeypress();
  simulateDownKeypress();
  simulateDownKeypress();
  assertListItemIsActive(3);
});

test.skip('should cycle to first/last acive element when navigation is set to "cycle"', () => {
  const wrapper = mount(
    <Listbox navigation="cycle">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateUpKeypress = simulateKeydown(wrapper, 'ArrowUp');
  const simulateDownKeypress = simulateKeydown(wrapper, 'ArrowDown');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  simulateDownKeypress();
  simulateDownKeypress();
  simulateDownKeypress();
  // First item should be active from cycled key navigation
  assertListItemIsActive(0);
  simulateUpKeypress();
  // Last item should be active from cycled key navigation
  assertListItemIsActive(3);
});

test('should handle <home> keypress', () => {
  const wrapper = mount(
    <Listbox defaultValue="Dragon Fruit">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateHomeKeypress = simulateKeydown(wrapper, 'Home');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  simulateHomeKeypress();
  assertListItemIsActive(0);
});

test.skip('should handle <end> keypress', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateHomeKeypress = simulateKeydown(wrapper, 'End');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  simulateHomeKeypress();
  assertListItemIsActive(3);
});
