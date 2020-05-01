import React from 'react';
import { mount } from 'enzyme';
import RadioGroup from 'src/components/RadioGroup';
import axe from '../../../axe';

const defaultProps = {
  name: 'fred',
  'aria-label': 'Fred is good',
  radios: [
    { value: 'foo', id: 'foo', label: 'Foo' },
    { value: 'bar', id: 'bar', label: 'Bar', disabled: true },
    { value: 'baz', id: 'baz', label: 'Baz' }
  ],
  onChange: () => {}
};

test('handles `defaultValue`', () => {
  const wrapper = mount(
    <RadioGroup {...defaultProps} defaultValue={defaultProps.radios[2].value} />
  );

  expect(
    wrapper
      .find('.dqpl-radio')
      .at(2)
      .hasClass('fa-dot-circle-o')
  ).toBeTruthy();
  expect(wrapper.find('.fa-dot-circle-o').length).toBe(1);
  expect(
    wrapper
      .find('[type="radio"]')
      .at(2)
      .getDOMNode().checked
  ).toBeTruthy();
});

test('handles `disabled` radio prop', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  expect(
    wrapper
      .find('.dqpl-radio')
      .at(1)
      .hasClass('dqpl-radio-disabled')
  ).toBeTruthy();
  expect(wrapper.find('.dqpl-radio-disabled').length).toBe(1);
  expect(
    wrapper
      .find('[type="radio"]')
      .at(1)
      .getDOMNode().disabled
  ).toBeTruthy();
});

test('handles focus', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  expect(wrapper.state('focusIndex')).toBeFalsy();
  wrapper
    .find('[type="radio"]')
    .at(0)
    .simulate('focus');
  expect(wrapper.state('focusIndex')).toBe(0);
  expect(
    wrapper
      .find('.dqpl-radio')
      .at(0)
      .hasClass('dqpl-radio-focused')
  ).toBeTruthy();
  expect(wrapper.find('.dqpl-radio-focused').length).toBe(1);
});

test('handles blur', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  wrapper
    .find('[type="radio"]')
    .at(0)
    .simulate('focus');
  expect(wrapper.state('focusIndex')).toBe(0);
  wrapper
    .find('[type="radio"]')
    .at(0)
    .simulate('blur');
  expect(wrapper.state('focusIndex')).toBeFalsy();
  expect(wrapper.find('.dqpl-radio-focused').length).toBe(0);
});

test('handles change', () => {
  let called = false;
  const onChange = () => (called = true);
  const wrapper = mount(<RadioGroup {...defaultProps} onChange={onChange} />);
  wrapper
    .find('[type="radio"]')
    .at(0)
    .simulate('change');
  expect(called).toBeTruthy();
  expect(wrapper.state('value')).toBe(defaultProps.radios[0].value);
});

test('handles clicks on the dqpl-overlay-radio element', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  const isChecked = () =>
    wrapper
      .find('[type="radio"]')
      .at(0)
      .getDOMNode().checked;
  expect(isChecked()).toBeFalsy();
  wrapper
    .find('.dqpl-overlay-radio')
    .at(0)
    .simulate('click');
  expect(isChecked()).toBeTruthy();
});

test('should return no axe violations', async () => {
  const radioGroup = mount(<RadioGroup {...defaultProps} />);
  expect(await axe(radioGroup.html())).toHaveNoViolations();
});
