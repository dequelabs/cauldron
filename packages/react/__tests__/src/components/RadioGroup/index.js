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
    { value: 'baz', id: 'baz', label: 'Baz', labelDescription: 'Baz stuff' }
  ],
  onChange: () => {}
};

test('handles `defaultValue`', () => {
  const wrapper = mount(
    <RadioGroup {...defaultProps} defaultValue={defaultProps.radios[2].value} />
  );
  expect(
    wrapper.find('.Icon.Radio__overlay').at(2).hasClass('Icon--radio-checked')
  ).toBeTruthy();
  expect(wrapper.find('.Icon--radio-checked').length).toBe(1);
  expect(
    wrapper.find('[type="radio"]').at(2).getDOMNode().checked
  ).toBeTruthy();
});

test('supports "controlled" radiogroups', () => {
  const wrapper = mount(
    <RadioGroup {...defaultProps} value={defaultProps.radios[2].value} />
  );
  expect(
    wrapper.find('.Icon.Radio__overlay').at(2).hasClass('Icon--radio-checked')
  ).toBeTruthy();
  expect(wrapper.find('.Icon--radio-checked').length).toBe(1);
  expect(
    wrapper.find('[type="radio"]').at(2).getDOMNode().checked
  ).toBeTruthy();

  wrapper.setProps({
    value: defaultProps.radios[1].value
  });

  wrapper.update();

  expect(
    wrapper.find('.Icon.Radio__overlay').at(1).hasClass('Icon--radio-checked')
  ).toBeTruthy();
  expect(wrapper.find('.Icon--radio-checked').length).toBe(1);
  expect(
    wrapper.find('[type="radio"]').at(1).getDOMNode().checked
  ).toBeTruthy();
});

test('handles `disabled` radio prop', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  expect(
    wrapper
      .find('.Icon.Radio__overlay')
      .at(1)
      .hasClass('Radio__overlay--disabled')
  ).toBeTruthy();
  expect(wrapper.find('.Field__label--disabled').length).toBe(1);
  expect(
    wrapper.find('[type="radio"]').at(1).getDOMNode().disabled
  ).toBeTruthy();
});

test('handles focus', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);

  expect(
    wrapper.find('.Radio__overlay').at(0).hasClass('Radio__overlay--focused')
  ).toBeFalsy();
  expect(wrapper.find('.Icon.Radio__overlay--focused').length).toBe(0);

  wrapper.find('[type="radio"]').at(0).simulate('focus');

  expect(
    wrapper.find('.Radio__overlay').at(0).hasClass('Radio__overlay--focused')
  ).toBeTruthy();
  expect(wrapper.find('.Icon.Radio__overlay--focused').length).toBe(1);
});

test('handles blur', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  wrapper.find('[type="radio"]').at(0).simulate('focus');
  expect(wrapper.find('.Radio__overlay--focused').length).toBeTruthy();
  wrapper.find('[type="radio"]').at(0).simulate('blur');
  expect(wrapper.find('.Radio__overlay--focused').length).toBe(0);
});

test('handles change', () => {
  let called = false;
  const onChange = () => (called = true);
  const wrapper = mount(<RadioGroup {...defaultProps} onChange={onChange} />);
  wrapper.find('[type="radio"]').at(0).simulate('change');
  expect(called).toBeTruthy();
});

test('handles clicks on the radio overlay element', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  const isChecked = () =>
    wrapper.find('[type="radio"]').at(0).getDOMNode().checked;
  expect(isChecked()).toBeFalsy();
  wrapper.find('.Radio__overlay').at(0).simulate('click');
  expect(isChecked()).toBeTruthy();
});

test('handles `labelDescription` value', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} />);
  const labelDescriptionId = wrapper
    .find('.Field__labelDescription')
    .at(0)
    .prop('id');
  expect(wrapper.find('.Field__labelDescription').length).toBe(1);
  expect(wrapper.find('#baz').at(0).prop('aria-describedby')).toBe(
    labelDescriptionId
  );
});

test('handles `inline` prop', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} inline />);
  expect(wrapper.find('[role="radiogroup"].Radio--inline').exists()).toBe(true);
});

test('handles `ref` prop', () => {
  const ref = React.createRef();
  mount(<RadioGroup {...defaultProps} ref={ref} />);
  expect(ref.current).toBeTruthy();
});

test('handles `tabIndex` prop', () => {
  const wrapper = mount(<RadioGroup {...defaultProps} tabIndex={-1} />);
  expect(wrapper.find('[role="radiogroup"]').prop('tabIndex')).toBe(-1);
});

test('should return no axe violations', async () => {
  const radioGroup = mount(<RadioGroup {...defaultProps} />);
  expect(await axe(radioGroup.html())).toHaveNoViolations();
});
