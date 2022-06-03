import React from 'react';
import { mount } from 'enzyme';
import RadioCardGroup from 'src/components/RadioCardGroup';
import axe from '../../../axe';

const defaultProps = {
  name: 'fred',
  'aria-label': 'Fred is good',
  radios: [
    {
      id: 'yes',
      value: 'yes',
      label: 'Yes',
      cardImgSrc: 'https://via.placeholder.com/150',
      cardIcon: 'check-circle'
    },
    {
      id: 'maybe',
      value: 'maybe',
      label: 'maybe',
      cardImgSrc: 'https://via.placeholder.com/150',
      cardIcon: 'check-circle',
      disabled: true
    },
    { value: 'bar', id: 'bar', label: 'Bar', disabled: true },
    {
      id: 'no',
      value: 'no',
      label: 'no',
      cardImgSrc: 'https://via.placeholder.com/150',
      cardIcon: 'check-circle'
    }
  ],
  onChange: () => {}
};

test('handles `defaultValue`', () => {
  const wrapper = mount(
    <RadioCardGroup
      {...defaultProps}
      defaultValue={defaultProps.radios[2].value}
    />
  );
  expect(
    wrapper.find('.Radio__overlay--checked.Radio__overlay--checked')
  ).toBeTruthy();
});

test('handles `disabled` radio prop', () => {
  const wrapper = mount(<RadioCardGroup {...defaultProps} />);
  expect(
    wrapper.find('Radio_card Radio__overlay Radio__overlay--disabled')
  ).toBeTruthy();
});

test('handles focus', () => {
  const wrapper = mount(<RadioCardGroup {...defaultProps} />);

  expect(
    wrapper
      .find('.Radio__overlay')
      .at(0)
      .hasClass('Radio__overlay--focused')
  ).toBeFalsy();
  expect(wrapper.find('.Icon.Radio__overlay--focused').length).toBe(0);

  wrapper
    .find('[type="radio"]')
    .at(0)
    .simulate('focus');

  expect(
    wrapper
      .find('.Radio__overlay')
      .at(0)
      .hasClass('Radio__overlay--focused')
  ).toBeTruthy();
});

test('should return no axe violations', async () => {
  const wrapper = mount(<RadioCardGroup {...defaultProps} />);

  expect(await axe(wrapper.html())).toHaveNoViolations();
});
