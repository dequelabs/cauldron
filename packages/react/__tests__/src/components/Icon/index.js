import React from 'react';
import { shallow, mount } from 'enzyme';
import Icon from '../../../../src/components/Icon';

test('handles classNames properly', () => {
  const icon = shallow(<Icon type="fa-foo-bar" className="baz" />);
  expect(icon.is('.fa.fa-foo-bar.baz')).toBe(true);
});

test('sets aria-hidden to "true" if no label is passed', () => {
  const icon = mount(<Icon type="fa-foo" />);
  // enzyme makes it hard to get attribute values...
  expect(icon.getDOMNode().getAttribute('aria-hidden')).toBe('true');
});

test('sets aria-hidden to "false" if no label is passed', () => {
  const icon = mount(<Icon type="fa-foo" label="Fred" />);
  expect(icon.getDOMNode().getAttribute('aria-hidden')).toBe('false');
});

test('sets aria-label to the value of the label prop', () => {
  const icon = mount(<Icon type="fa-foo" label="Fred" />);
  expect(icon.getDOMNode().getAttribute('aria-label')).toBe('Fred');
});
