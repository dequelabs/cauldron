import React from 'react';
import { mount } from 'enzyme';
import {
  default as Listbox,
  ListboxGroup,
  ListboxOption,
} from 'src/components/Listbox';

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

  const group = wrapper.find(ListboxGroup).find('ul');
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
  const li = wrapper.find('li');

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
  const li = wrapper.find('li');

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
  const li = wrapper.find('li');

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
  const li = wrapper.find('li');

  expect(li.at(0).prop('aria-selected')).toBeFalsy();
  expect(li.at(1).prop('aria-selected')).toEqual(true);
  expect(li.at(2).prop('aria-selected')).toBeFalsy();
});
