import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import {
  default as Listbox,
  ListboxGroup,
  ListboxOption
} from 'src/components/Listbox';

// Utility function for checking for active element for the given li index of a Listbox component
const listItemIsActive = (wrapper) => (index) => {
  const ul = wrapper.find(Listbox).childAt(0);
  const options = ul.find('[role="option"]');
  const activeOption = options.at(index);
  expect(ul.prop('aria-activedescendant')).toBeTruthy();
  expect(ul.find('[role="listbox"]').prop('aria-activedescendant')).toEqual(
    activeOption.prop('id')
  );
  expect(activeOption.hasClass('ListboxOption--active')).toBeTruthy();
  options.forEach(
    (option, index) =>
      index !== index &&
      expect(option).hasClass('ListboxOption--active').toBeFalsy()
  );
};

// Utility function for checking for selected element for the given li index of a Listbox component
const listItemIsSelected = (wrapper) => (index) => {
  const options = wrapper.find('[role="option"]');
  const selectedOption = options.at(index);
  expect(selectedOption.prop('aria-selected')).toEqual(true);
  options.forEach(
    (option, index) =>
      index !== index && expect(option).prop('aria-selected').toEqual(false)
  );
};

const simulateKeydown =
  (wrapper, key) =>
  (event = {}) => {
    wrapper.simulate('keydown', { key, ...event });
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

test('should set "as" element for listbox', () => {
  const wrapper = mount(
    <Listbox as="span">
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(
    wrapper.find(Listbox).children('span[role="listbox"]').exists()
  ).toBeTruthy();
});

test('should set "as" element for listbox option', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption as="span">Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(
    wrapper.find(ListboxOption).children('span[role="option"]').exists()
  ).toBeTruthy();
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
  expect(group1.find('ul').prop('aria-labelledby')).toBeTruthy();
  expect(group2.find('ul').prop('aria-labelledby')).toBeTruthy();
  expect(group1.find(ListboxOption).at(0).text()).toEqual('Apple');
  expect(group1.find(ListboxOption).at(1).text()).toEqual('Banana');
  expect(group1.find(ListboxOption).at(2).text()).toEqual('Cantaloupe');
  expect(group2.find(ListboxOption).at(0).text()).toEqual('Artichoke');
  expect(group2.find(ListboxOption).at(1).text()).toEqual('Broccoli');
  expect(group2.find(ListboxOption).at(2).text()).toEqual('Carrots');
});

test('should use prop id for listbox group', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxGroup id="fruit" label="Fruit">
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  expect(wrapper.find('ul[role="group"]').prop('aria-labelledby')).toEqual(
    'fruit'
  );
  expect(wrapper.find('li[role="presentation"]').prop('id')).toEqual('fruit');
});

test('should set group label props', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxGroup label="Fruit" groupLabelProps={{ 'data-value': 'true' }}>
        <ListboxOption>Apple</ListboxOption>
        <ListboxOption>Banana</ListboxOption>
        <ListboxOption>Cantaloupe</ListboxOption>
      </ListboxGroup>
    </Listbox>
  );

  expect(wrapper.find('li[role="presentation"]').prop('data-value')).toEqual(
    'true'
  );
});

test('should use prop id for listbox option', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption id="apple">Apple</ListboxOption>
      <ListboxOption>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
    </Listbox>
  );

  expect(
    wrapper.find(ListboxOption).find('[role="option"]').at(0).prop('id')
  ).toEqual('apple');
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
  const listbox = wrapper.find('[role="listbox"]');
  const option = wrapper.find('[role="option"]').at(1);

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

  const assertListItemIsSelected = listItemIsSelected(wrapper);
  assertListItemIsSelected(1);
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

  const assertListItemIsSelected = listItemIsSelected(wrapper);
  assertListItemIsSelected(1);
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

  const assertListItemIsSelected = listItemIsSelected(wrapper);
  assertListItemIsSelected(1);
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

  const assertListItemIsSelected = listItemIsSelected(wrapper);
  assertListItemIsSelected(1);
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

test('should handle ↑ keypress', () => {
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

test('should cycle to first/last acive element when navigation is set to "cycle"', () => {
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

test('should handle <end> keypress', () => {
  const wrapper = mount(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateEndKeyPress = simulateKeydown(wrapper, 'End');
  listbox.simulate('focus');

  const assertListItemIsActive = listItemIsActive(wrapper);

  simulateEndKeyPress();
  assertListItemIsActive(3);
});

test('should handle onActiveChange', () => {
  const onActiveChange = spy();
  const wrapper = mount(
    <Listbox onActiveChange={onActiveChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const simulateDownKeypress = simulateKeydown(wrapper, 'ArrowDown');

  expect(onActiveChange.notCalled).toBeTruthy();
  simulateDownKeypress();
  expect(onActiveChange.lastCall.firstArg.value).toEqual('Apple');
  simulateDownKeypress();
  expect(onActiveChange.lastCall.firstArg.value).toEqual('Cantaloupe');
  simulateDownKeypress();
  expect(onActiveChange.lastCall.firstArg.value).toEqual('Dragon Fruit');
});

test('should handle listbox selection with "enter" keypress', () => {
  const onSelect = spy();
  const onSelectionChange = spy();
  const wrapper = mount(
    <Listbox onSelect={onSelect} onSelectionChange={onSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateDownKeypress = simulateKeydown(wrapper, 'ArrowDown');
  const simulateEnterKeypress = simulateKeydown(wrapper, 'Enter');
  listbox.simulate('focus');

  const assertListItemIsSelected = listItemIsSelected(wrapper);

  expect(onSelect.notCalled).toBeTruthy();
  expect(onSelectionChange.notCalled).toBeTruthy();

  simulateDownKeypress();
  simulateEnterKeypress();
  assertListItemIsSelected(2);

  expect(onSelect.calledOnce).toBeTruthy();
  expect(onSelectionChange.calledOnce).toBeTruthy();
  expect(onSelect.calledWithMatch({ value: 'Cantaloupe' })).toBeTruthy();
  expect(
    onSelectionChange.calledWithMatch({ value: 'Cantaloupe' })
  ).toBeTruthy();
});

test('should handle listbox selection with "space" keypress', () => {
  const onSelect = spy();
  const onSelectionChange = spy();
  const wrapper = mount(
    <Listbox onSelect={onSelect} onSelectionChange={onSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateDownKeypress = simulateKeydown(wrapper, 'ArrowDown');
  const simulateSpaceKeypress = simulateKeydown(wrapper, ' ');
  listbox.simulate('focus');

  const assertListItemIsSelected = listItemIsSelected(wrapper);

  expect(onSelect.notCalled).toBeTruthy();
  expect(onSelectionChange.notCalled).toBeTruthy();

  simulateDownKeypress();
  simulateSpaceKeypress();
  assertListItemIsSelected(2);

  expect(onSelect.calledOnce).toBeTruthy();
  expect(onSelectionChange.calledOnce).toBeTruthy();
  expect(onSelect.calledWithMatch({ value: 'Cantaloupe' })).toBeTruthy();
  expect(
    onSelectionChange.calledWithMatch({ value: 'Cantaloupe' })
  ).toBeTruthy();
});

test('should not prevent default event with non-navigational keypress', () => {
  const event = { preventDefault: spy(), bla: 'bla' };
  const wrapper = mount(
    <Listbox>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  const listbox = wrapper.find(Listbox).childAt(0);
  const simulateTabKeypress = simulateKeydown(wrapper, 'Tab');
  const simulateEscKeypress = simulateKeydown(wrapper, 'Escape');
  const simulateDownKeypress = simulateKeydown(wrapper, 'ArrowDown');
  listbox.simulate('focus');

  simulateTabKeypress(event);
  expect(event.preventDefault.notCalled).toBeTruthy();
  simulateEscKeypress(event);
  expect(event.preventDefault.notCalled).toBeTruthy();
  simulateDownKeypress(event);
  expect(event.preventDefault.calledOnce).toBeTruthy();
});

test('should handle listbox selection with "click" event', () => {
  const onSelect = spy();
  const onSelectionChange = spy();
  const wrapper = mount(
    <Listbox onSelect={onSelect} onSelectionChange={onSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );

  expect(onSelect.notCalled).toBeTruthy();
  expect(onSelectionChange.notCalled).toBeTruthy();

  wrapper.find('[role="option"]').at(2).simulate('click');

  const assertListItemIsSelected = listItemIsSelected(wrapper);
  assertListItemIsSelected(2);

  expect(onSelect.calledOnce).toBeTruthy();
  expect(onSelectionChange.calledOnce).toBeTruthy();
  expect(onSelect.calledWithMatch({ value: 'Cantaloupe' })).toBeTruthy();
  expect(
    onSelectionChange.calledWithMatch({ value: 'Cantaloupe' })
  ).toBeTruthy();
});

test('should not invoke selection for disabled elements with "click" event', () => {
  const onSelect = spy();
  const onSelectionChange = spy();
  const wrapper = mount(
    <Listbox onSelect={onSelect} onSelectionChange={onSelectionChange}>
      <ListboxOption>Apple</ListboxOption>
      <ListboxOption disabled>Banana</ListboxOption>
      <ListboxOption>Cantaloupe</ListboxOption>
      <ListboxOption>Dragon Fruit</ListboxOption>
    </Listbox>
  );
  wrapper.find('[role="option"]').at(1).simulate('click');

  expect(onSelect.notCalled).toBeTruthy();
  expect(onSelectionChange.notCalled).toBeTruthy();
});
