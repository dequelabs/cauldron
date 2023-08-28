import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import {
  default as Combobox,
  ComboboxGroup,
  ComboboxOption
} from 'src/components/Combobox';

const simulateKeyDown =
  (wrapper, key) =>
  (event = {}) => {
    wrapper.simulate('keydown', { key, ...event });
    wrapper.update();
  };

// Utility function for checking if the ComboboxListbox is currently open
const listboxIsOpen = (wrapper) => (isOpen) => {
  const Listbox = wrapper.find('ul[role="listbox"]');
  const input = wrapper.find('[role="combobox"]');
  expect(input.prop('aria-expanded')).toEqual(isOpen);
  if (isOpen) {
    expect(Listbox.prop('className')).toContain('Combobox__listbox--open');
  } else {
    expect(Listbox.prop('className')).not.toContain('Combobox__listbox--open');
  }
};

// Utility function for checking for active element for the given Combobox Option of a Listbox component
const optionIsActive = (wrapper) => (index) => {
  const combobox = wrapper.find('input[role="combobox"]');
  const options = wrapper.find('[role="listbox"] [role="option"]');
  const activeOption = options.at(index);
  expect(combobox.prop('aria-activedescendant')).toBeTruthy();
  expect(combobox.prop('aria-activedescendant')).toEqual(
    activeOption.prop('id')
  );
  expect(activeOption.hasClass('ComboboxOption--active')).toBeTruthy();
  options.forEach(
    (option, index) =>
      index !== index &&
      expect(option).hasClass('ComboboxOption--active').toBeFalsy()
  );
};

test('should render combobox with options', () => {
  const options = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' },
    { value: 'Cantaloupe', label: 'Cantaloupe' }
  ];
  const wrapper = mount(<Combobox options={options} />);
  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(wrapper.find(ComboboxOption).at(0).text()).toEqual('Apple');
  expect(wrapper.find(ComboboxOption).at(1).text()).toEqual('Banana');
  expect(wrapper.find(ComboboxOption).at(2).text()).toEqual('Cantaloupe');
});

test('should render combobox with children', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(wrapper.find(ComboboxOption).at(0).text()).toEqual('Apple');
  expect(wrapper.find(ComboboxOption).at(1).text()).toEqual('Banana');
  expect(wrapper.find(ComboboxOption).at(2).text()).toEqual('Cantaloupe');
});

test('should render combobox with groups', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxGroup label="Fruit">
        <ComboboxOption>Apple</ComboboxOption>
        <ComboboxOption>Banana</ComboboxOption>
        <ComboboxOption>Cantaloupe</ComboboxOption>
      </ComboboxGroup>
      <ComboboxGroup label="Vegetables">
        <ComboboxOption>Artichoke</ComboboxOption>
        <ComboboxOption>Broccoli</ComboboxOption>
        <ComboboxOption>Carrots</ComboboxOption>
      </ComboboxGroup>
    </Combobox>
  );

  const group1 = wrapper.find(ComboboxGroup).at(0);
  const group2 = wrapper.find(ComboboxGroup).at(1);

  expect(wrapper.find(Combobox).exists()).toBeTruthy();
  expect(group1.exists()).toBeTruthy();
  expect(group2.exists()).toBeTruthy();
  expect(group1.find('ul').prop('role')).toEqual('group');
  expect(group2.find('ul').prop('role')).toEqual('group');
  expect(group1.find('ul').prop('aria-labelledby')).toBeTruthy();
  expect(group2.find('ul').prop('aria-labelledby')).toBeTruthy();
  expect(group1.find(ComboboxOption).at(0).text()).toEqual('Apple');
  expect(group1.find(ComboboxOption).at(1).text()).toEqual('Banana');
  expect(group1.find(ComboboxOption).at(2).text()).toEqual('Cantaloupe');
  expect(group2.find(ComboboxOption).at(0).text()).toEqual('Artichoke');
  expect(group2.find(ComboboxOption).at(1).text()).toEqual('Broccoli');
  expect(group2.find(ComboboxOption).at(2).text()).toEqual('Carrots');
});

test('should open combobox listbox on click', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('click');
  assertListboxIsOpen(true);
});

test('should open combobox listbox on focus', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('focus');
  assertListboxIsOpen(true);
});

test('should open combobox listbox on keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'ArrowDown' });
  assertListboxIsOpen(true);
});

test('should close combobox listbox on "esc" keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'ArrowDown' });
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'A' });
  assertListboxIsOpen(true);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'Escape' });
  assertListboxIsOpen(false);
});

test('should not open combobox listbox on "enter" keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('keydown', { key: 'Enter' });
  assertListboxIsOpen(false);
});

test('should close combobox listbox on "blur"', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('focus');
  assertListboxIsOpen(true);
  wrapper.find('[role="combobox"]').simulate('blur');
  assertListboxIsOpen(false);
});

test('should close combobox listbox when selecting option via click', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);

  assertListboxIsOpen(false);
  wrapper.find('[role="combobox"]').simulate('focus');
  assertListboxIsOpen(true);
  wrapper.find('li[role="option"]').at(0).simulate('click');
  assertListboxIsOpen(false);
});

test('should not close combobox listbox when selecting option via keypress', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  assertListboxIsOpen(false);
  combobox.simulate('focus');
  assertListboxIsOpen(true);
  combobox.simulate('keydown', { key: 'ArrowDown' });
  combobox.simulate('keydown', { key: 'ArrowDown' });
  combobox.simulate('keydown', { key: 'Enter' });
  assertListboxIsOpen(true);
});

test('should set aria-activedescendent for active combobox options', () => {
  const wrapper = mount(
    <Combobox>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom/enzyme so we fire the events directly on listbox
  const simulateArrowKeyDown = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'ArrowDown'
  );
  const assertOptionIsActive = optionIsActive(wrapper);

  expect(combobox.prop('aria-activedescendant')).toBeFalsy();
  combobox.simulate('focus');
  assertListboxIsOpen(true);
  simulateArrowKeyDown();
  assertOptionIsActive(0);
  simulateArrowKeyDown();
  assertOptionIsActive(1);
  simulateArrowKeyDown();
  assertOptionIsActive(2);
});

test('should call onActiveChange when active option changes', () => {
  const onActiveChange = spy();
  const wrapper = mount(
    <Combobox onActiveChange={onActiveChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');
  // Note: Combobox forwards events to Listbox via dispatchEvent, but this doesn't
  // work correctly within jsdom/enzyme so we fire the events directly on listbox
  const simulateArrowKeyDown = simulateKeyDown(
    wrapper.find('ul[role="listbox"]'),
    'ArrowDown'
  );

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  expect(onActiveChange.notCalled).toBeTruthy();
  simulateArrowKeyDown();
  expect(onActiveChange.callCount).toEqual(1);
  expect(onActiveChange.getCall(0).firstArg.value).toEqual('Apple');
  simulateArrowKeyDown();
  expect(onActiveChange.callCount).toEqual(2);
  expect(onActiveChange.getCall(1).firstArg.value).toEqual('Banana');
  simulateArrowKeyDown();
  expect(onActiveChange.callCount).toEqual(3);
  expect(onActiveChange.getCall(2).firstArg.value).toEqual('Cantaloupe');
});

test.skip('should handle selection with "click" event', () => {
  const onSelectionChange = spy();
  const wrapper = mount(
    <Combobox onSelectionChange={onSelectionChange}>
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );

  const assertListboxIsOpen = listboxIsOpen(wrapper);
  const combobox = wrapper.find('[role="combobox"]');

  combobox.simulate('focus');
  assertListboxIsOpen(true);
  expect(onSelectionChange.notCalled).toBeTruthy();
  wrapper.find('[role="option"]').at(1).simulate('click');
  wrapper.update();
  expect(onSelectionChange.callCount).toEqual(1);
  expect(onSelectionChange.firstCall.firstArg.value).toEqual('Banana');
  expect(onSelectionChange.firstCall.firstArg.previousValue).toEqual(undefined);
  combobox.simulate('click');
  wrapper.find('[role="option"]').at(2).simulate('click');
  expect(onSelectionChange.secondCall.firstArg.value).toEqual('Cantaloupe');
  expect(onSelectionChange.secondCall.firstArg.previousValue).toEqual('Banana');
});

test.todo('should handle selection with "enter" keydown event');

test.todo('should render all options when autocomplete="none"');

test.todo('should render matching options when autocomplete="manual"');

test.todo(
  'should render results not found when no options match when autocomplete="manual"'
);

test.todo('should render matching options when autocomplete="automatic"');

test.todo(
  'should render results not found when no options match when autocomplete="automatic"'
);

test.todo(
  'should set first active descendent when autocomplete="automatic" on open'
);

test('should use id from props when set', () => {
  const wrapper = mount(
    <Combobox id="this-is-a-combobox">
      <ComboboxOption>Apple</ComboboxOption>
      <ComboboxOption>Banana</ComboboxOption>
      <ComboboxOption>Cantaloupe</ComboboxOption>
    </Combobox>
  );
  expect(wrapper.find('.Combobox').prop('id')).toEqual('this-is-a-combobox');
});

test.todo('should set selected value with "defaultValue" prop');

test.todo('should set selected value with "value" prop');
