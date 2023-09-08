import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import TagButton from 'src/components/TagButton';
import axe from '../../../axe';

const update = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setImmediate(resolve));
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

test('should render tag component in case when disabled state is absent', async () => {
  const wrapper = mount(
    <TagButton icon="pencil" label="Edit: " value={'value'} />
  );
  await update(wrapper);
  const button = wrapper.find('button');
  expect(button.exists()).toBe(false);
  const tag = wrapper.find('.Tag');
  expect(tag.exists()).toBe(true);
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

test('should support adding className to tag (in case when disabled state is not provided', async () => {
  const wrapper = mount(
    <TagButton icon="pencil" label="Edit: " value={'value'} className="foo" />
  );
  await update(wrapper);
  expect(wrapper.find('div.TagButton').hasClass('foo')).toBeTruthy();
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
      action={action}
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
      action={action}
    />
  );
  await update(wrapper);

  await act(async () => {
    wrapper.find('button.TagButton').simulate('click');
  });

  expect(action).not.toHaveBeenCalled();
});

test('action should not be called on click button, if state is not provided', async () => {
  const action = jest.fn().mockImplementation(() => {});
  const wrapper = mount(
    <TagButton
      icon="pencil"
      label="Edit: "
      value={'value'}
      className="foo"
      action={action}
    />
  );
  await update(wrapper);

  await act(async () => {
    wrapper.find('div.TagButton').simulate('click');
  });

  expect(action).not.toHaveBeenCalled();
});
