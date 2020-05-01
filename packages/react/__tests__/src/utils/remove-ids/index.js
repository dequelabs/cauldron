import React from 'react';
import { mount } from 'enzyme';
import removeIds from '../../../../src/utils/remove-ids';

test('should remove id from rendered node', () => {
  const Foo = () => removeIds(<div id="foo" />);
  const wrapper = mount(<Foo />);
  expect(wrapper.find('div').prop('id')).toBeFalsy();
});

test('should remove id from rendered child nodes', () => {
  const Foo = () =>
    removeIds(
      <div>
        <div id="foo1" />
        <div id="foo2" />
      </div>
    );
  const wrapper = mount(<Foo />);
  const [foo1, foo2] = wrapper.find('div > div').map(child => child);
  expect(foo1.prop('id')).toBeFalsy();
  expect(foo2.prop('id')).toBeFalsy();
});

test('should allow other props to persist', () => {
  const Foo = () => removeIds(<div id="foo" className="bar" />);
  const wrapper = mount(<Foo />);
  expect(wrapper.find('div').prop('className')).toEqual('bar');
});
