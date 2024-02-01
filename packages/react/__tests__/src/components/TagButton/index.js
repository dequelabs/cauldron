import React from 'react';
import { setImmediate } from 'timers/promises';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TagButton from 'src/components/TagButton';
import axe from '../../../axe';

const update = async (wrapper) => {
  await act(async () => {
    await setImmediate();
    wrapper.update();
  });
};

test('should render button by default', async () => {
  const wrapper = mount(
    <TagButton icon="pencil" label="Edit: " value={'value'} disabled={false} />
  );
  await update(wrapper);
  const button = wrapper.find('button');
  expect(button.exists()).toBe(true);
  expect(button.prop('type')).toBe('button');
  expect(button.prop('role')).toBeUndefined();
  expect(button.text()).toBe('Edit: value');
});

test('should support adding className to button', async () => {
  const wrapper = mount(
    <TagButton
      icon="pencil"
      label="Edit: "
      value={'value'}
      disabled={false}
      className="foo"
    />
  );
  await update(wrapper);
  expect(wrapper.find('button.TagButton').hasClass('foo')).toBeTruthy();
});

test('action is called on click button', async () => {
  const action = jest.fn().mockImplementation(() => {});
  const wrapper = mount(
    <TagButton
      icon="pencil"
      label="Edit: "
      value={'value'}
      className="foo"
      disabled={false}
      onClick={action}
    />
  );
  await update(wrapper);

  await act(async () => {
    wrapper.find('button.TagButton').simulate('click');
  });

  expect(action).toHaveBeenCalled();
});

test('action should not be called on click button, if state is provided and disabled', async () => {
  const action = jest.fn().mockImplementation(() => {});
  const wrapper = mount(
    <TagButton
      icon="pencil"
      label="Edit: "
      value={'value'}
      className="foo"
      disabled={true}
      onClick={action}
    />
  );
  await update(wrapper);

  await act(async () => {
    wrapper.find('button.TagButton').simulate('click');
  });

  expect(action).not.toHaveBeenCalled();
});

test('should return no axe violations', async () => {
  const wrapper = mount(
    <TagButton
      icon="pencil"
      label="Edit: "
      value={'value'}
      disabled={false}
      className="foo"
    />
  );
  expect(await axe(wrapper.html())).toHaveNoViolations();
});
