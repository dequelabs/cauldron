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
      cardImg: <img src="https://via.placeholder.com/150" alt="" />,
      cardIcon: 'check-circle'
    },
    {
      id: 'no',
      value: 'no',
      label: 'No',
      disabled: true,
      cardImg: (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="red" />
        </svg>
      ),
      cardIcon: 'check-circle'
    },
    {
      id: 'tuesday',
      value: 'tuesday',
      label: 'Only on Tuesdays',
      cardImg: (
        <div
          style={{
            backgroundColor: 'green',
            height: 100,
            width: 100,
            borderRadius: 50
          }}
        ></div>
      ),
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
    wrapper.find('.RadioCard__overlay--checked.RadioCard__overlay--checked')
  ).toBeTruthy();
});

test('handles `disabled` radio prop', () => {
  const wrapper = mount(<RadioCardGroup {...defaultProps} />);
  expect(
    wrapper.find('Radio_card RadioCard__overlay RadioCard__overlay--disabled')
  ).toBeTruthy();
});

test('handles focus', () => {
  const wrapper = mount(<RadioCardGroup {...defaultProps} />);

  expect(
    wrapper
      .find('.RadioCard__overlay')
      .at(0)
      .hasClass('RadioCard__overlay--focused')
  ).toBeFalsy();
  expect(wrapper.find('.RadioCard__overlay--focused').length).toBe(0);

  wrapper
    .find('[type="radio"]')
    .at(0)
    .simulate('focus');

  expect(
    wrapper
      .find('.RadioCard__overlay')
      .at(0)
      .hasClass('RadioCard__overlay--focused')
  ).toBeTruthy();
});

test('should return no axe violations', async () => {
  const wrapper = mount(<RadioCardGroup {...defaultProps} />);

  expect(await axe(wrapper.html())).toHaveNoViolations();
});
