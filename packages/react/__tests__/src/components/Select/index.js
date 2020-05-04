import React from 'react';
import { mount } from 'enzyme';
import Select from 'src/components/Select';
import axe from '../../../axe';

const defaultProps = {
  label: 'Fred'
};
const withDefaultSelected = (otherProps = {}) => {
  return mount(
    <Select
      {...defaultProps}
      {...otherProps}
      value="Bill"
      options={[
        { value: 'Fred' },
        { value: 'Bill' },
        { value: 'Ted' },
        { value: 'Bob' }
      ]}
    />
  );
};
const basicSelect = (otherProps = {}) => {
  return mount(
    <Select
      {...defaultProps}
      {...otherProps}
      options={[{ value: 'a' }, { value: 'b' }, { value: 'c' }]}
    />
  );
};

test('renders the expected UI', () => {
  const wrapper = withDefaultSelected();

  expect(wrapper.find('.dqpl-field-wrap').exists()).toBeTruthy();
  expect(wrapper.find('.dqpl-label')).toBeTruthy();
  expect(wrapper.find('.dqpl-listbox-button')).toBeTruthy();
  expect(wrapper.find('.dqpl-listbox')).toBeTruthy();
});

test('clicking the label, focuses the listbox button', () => {
  const wrapper = withDefaultSelected();
  wrapper.find('.dqpl-label').simulate('click');

  expect(wrapper.instance().select).toBe(document.activeElement);
});

test('handles initially selected option', () => {
  const select = withDefaultSelected();

  expect(select.state('activeIndex')).toBe(1);
  expect(select.state('selectedIndex')).toBe(1);
  expect(select.find('.dqpl-listbox-button').text()).toBe('Bill');
});

test('handles programmatically selecting an option (via the `value` prop)', () => {
  let called = false;
  const select = basicSelect({
    onSelect: () => (called = true)
  });
  select.setProps({
    value: 'c'
  });

  expect(select.state('selectedIndex')).toBe(2);
  expect(select.state('activeIndex')).toBe(2);
  expect(called).toBeTruthy();
});

test('sets option attributes properly', () => {
  const select = mount(
    <Select
      {...defaultProps}
      value="a"
      options={[{ value: 'a' }, { disabled: true, value: 'b' }, { value: 'c' }]}
    />
  );
  const opts = select.find('.dqpl-option[role="option"]');
  expect(opts.length).toBe(3);
  opts.forEach((opt, i) => {
    expect(opt.hasClass('dqpl-option-active')).toBe(i == 0);
    expect(opt.is({ 'aria-selected': i === 0 })).toBeTruthy();
    expect(opt.is({ 'aria-disabled': true })).toBe(i == 1);
  });
});

test('clicking the trigger toggles the "expanded" state', () => {
  const wrapper = basicSelect();
  const trigger = wrapper.find('[aria-haspopup="listbox"]');
  trigger.simulate('click');
  expect(wrapper.state('expanded')).toBeTruthy();
  trigger.simulate('click');
  expect(wrapper.state('expanded')).toBeFalsy();
});

test('handles "down" arrow key (with collapsed list)', () => {
  const wrapper = basicSelect();
  expect(wrapper.state('expanded')).toBeFalsy();
  wrapper.find('[aria-haspopup="listbox"]').simulate('keydown', { which: 40 });
  expect(wrapper.state('expanded')).toBeTruthy();
});

test('handles clicks on options', () => {
  let called = false;
  const select = withDefaultSelected({
    onSelect: () => (called = true)
  });
  select
    .find('.dqpl-option')
    .at(3)
    .simulate('click');

  expect(select.state('activeIndex')).toBe(3);
  expect(select.state('selectedIndex')).toBe(3);
  expect(called).toBeTruthy();
  expect(select.instance().select).toBe(document.activeElement);
});

test('handles "down" arrow key', () => {
  const wrapper = withDefaultSelected();
  wrapper.setState({ expanded: true });
  expect(wrapper.state('activeIndex')).toBe(1);
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 40 });
  expect(wrapper.state('activeIndex')).toBe(2);
});

test('handles "up" arrow key', () => {
  const wrapper = withDefaultSelected();
  wrapper.setState({ expanded: true });
  expect(wrapper.state('activeIndex')).toBe(1);

  wrapper.find('[role="listbox"]').simulate('keydown', { which: 38 });
  expect(wrapper.state('activeIndex')).toBe(0);
});

test('handles "esc" / "tab" keys', () => {
  const wrapper = withDefaultSelected();
  wrapper.setState({ expanded: true, activeIndex: 0 });
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 27 });
  expect(wrapper.state('expanded')).toBeFalsy();
  expect(wrapper.state('activeIndex')).toBe(1);
});

test('handles "enter" / "space" keys', () => {
  const wrapper = withDefaultSelected();
  expect(wrapper.state('selectedIndex')).toBe(1);
  wrapper.setState({ expanded: true, activeIndex: 2 });
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 13 });
  expect(wrapper.state('selectedIndex')).toBe(2);
});

test('handles searching', () => {
  const wrapper = mount(
    <Select
      {...defaultProps}
      value="Bar"
      options={[
        { value: 'Bar' },
        { value: 'Foo' },
        { value: 'Far' },
        { value: 'Fan' },
        { value: 'Fun' }
      ]}
    />
  );
  // open the list
  wrapper.setState({ expanded: true });
  // fire an "f" keydown
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 70 });
  expect(wrapper.state('activeIndex')).toBe(1);
  // fire a "u" keydown
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 85 });
  expect(wrapper.state('activeIndex')).toBe(4);
});

test('skips disabled items', () => {
  const wrapper = mount(
    <Select
      {...defaultProps}
      options={[
        { value: 'one' },
        { value: 'two', disabled: true },
        { value: 'three' }
      ]}
    />
  );
  wrapper.setState({ expanded: true });
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 40 });
  expect(wrapper.state('activeIndex')).toBe(2);
});

test('handles top/bottom boundaries', () => {
  const wrapper = basicSelect();
  wrapper.setState({ expanded: true, activeIndex: 0 });
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 38 });
  expect(wrapper.state('activeIndex')).toBe(0);
  wrapper.setState({ activeIndex: 2 });
  wrapper.find('[role="listbox"]').simulate('keydown', { which: 40 });
  expect(wrapper.state('activeIndex')).toBe(2);
});

test('should return no axe violations', async () => {
  const select = mount(
    <Select
      {...defaultProps}
      value="Bar"
      options={[
        { value: 'Bar' },
        { value: 'Foo' },
        { value: 'Far' },
        { value: 'Fan' },
        { value: 'Fun' }
      ]}
    />
  );
  // default collapsed state
  expect(await axe(select.html())).toHaveNoViolations();
  // expanded state
  select.setState({ expanded: true });
  expect(await axe(select.html())).toHaveNoViolations();
  // with selection
  select.setState({ activeIndex: 1 });
  expect(await axe(select.html())).toHaveNoViolations();
});
