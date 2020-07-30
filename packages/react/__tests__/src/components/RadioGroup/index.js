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
      .find('.Radio__overlay')
      .at(2)
      .hasClass('Icon--radio-checked')
  ).toBeTruthy();
  expect(wrapper.find('.Icon--radio-checked').length).toBe(1);
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
      .find('.Radio__overlay')
      .at(1)
      .hasClass('Radio__overlay--disabled')
  ).toBeTruthy();
  expect(wrapper.find('.Field__label--disabled').length).toBe(1);
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
      .find('.Radio__overlay')
      .at(0)
      .hasClass('Radio__overlay--focused')
  ).toBeTruthy();
  expect(wrapper.find('.Radio__overlay--focused').length).toBe(1);
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
  expect(wrapper.find('.Radio__overlay--focused').length).toBe(0);
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

test('handles clicks on the radio overlay element', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  const isChecked = () =>
    wrapper
      .find('[type="radio"]')
      .at(0)
      .getDOMNode().checked;
  expect(isChecked()).toBeFalsy();
  wrapper
    .find('.Radio__overlay')
    .at(0)
    .simulate('click');
  expect(isChecked()).toBeTruthy();
});

test('should return no axe violations', async () => {
  const radioGroup = mount(<RadioGroup {...defaultProps} />);
  expect(await axe(radioGroup.html())).toHaveNoViolations();
});
