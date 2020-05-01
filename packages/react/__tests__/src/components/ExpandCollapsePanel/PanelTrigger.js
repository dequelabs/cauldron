import React from 'react';
import { shallow } from 'enzyme';
import { PanelTrigger } from 'src/components/ExpandCollapsePanel';

test('should render children', () => {
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

test('should pass-through props', () => {
  const wrapper = shallow(<PanelTrigger foo="bar" />);

  expect(wrapper.props().foo).toBe('bar');
});

test('should handle onclick', () => {
  const handleClick = jest.fn();
  const wrapper = shallow(<PanelTrigger onClick={handleClick} />);

  wrapper.simulate('click');
  expect(handleClick).toBeCalled();
});
