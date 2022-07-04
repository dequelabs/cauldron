import React from 'react';
import { shallow, mount } from 'enzyme';
import { PanelTrigger } from 'src/components/ExpandCollapsePanel';

test('should renders children', () => {
  const children = <div>Hello World</div>;
  const wrapper = shallow(<PanelTrigger>{children}</PanelTrigger>);

  expect(wrapper.contains(children)).toBeTruthy();
});

test('should render functional children', () => {
  const fn = ({ open }) => (open ? 'Open' : 'Closed');
  const wrapper = shallow(<PanelTrigger open>{fn}</PanelTrigger>);

  expect(wrapper.contains('Open')).toBeTruthy();
  wrapper.setProps({ open: false });
  expect(wrapper.contains('Closed')).toBeTruthy();
});

test('should pass-through props allowed in its extended type', () => {
  const wrapper = mount(<PanelTrigger type="submit" />);

  expect(wrapper.props().type).toBe('submit');
});

test('should handle onclick', () => {
  const handleClick = jest.fn();
  const wrapper = mount(<PanelTrigger onClick={handleClick} />);

  wrapper.simulate('click');
  expect(handleClick).toBeCalled();
});

test('should render default trigger icons', () => {
  const wrapper = shallow(<PanelTrigger />);
  expect(wrapper.find('Icon').props('type')).toEqual({
    type: 'chevron-right'
  });
  wrapper.setProps({ open: true });
  expect(wrapper.find('Icon').props('type')).toEqual({
    type: 'chevron-down'
  });
});

test('should render custom trigger icons', () => {
  const wrapper = shallow(
    <PanelTrigger iconExpanded="triangle-down" iconCollapsed="triangle-right" />
  );
  expect(wrapper.find('Icon').props('type')).toEqual({
    type: 'triangle-right'
  });
  wrapper.setProps({ open: true });
  expect(wrapper.find('Icon').props('type')).toEqual({
    type: 'triangle-down'
  });
});
