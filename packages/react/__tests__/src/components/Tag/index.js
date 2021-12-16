import React from 'react';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
import Tag, { TagLabel } from '../../../../src/components/Tag';
import axe from '../../../axe';

test('renders children', () => {
  const tag = mount(
    <Tag>
      <TagLabel>Label:</TagLabel> value
    </Tag>
  );

  expect(tag.text()).toBe('Label: value');
});

test('passes classNames through', () => {
  const tag = shallow(<Tag className="baz">hi</Tag>);
  const tagLabel = shallow(<TagLabel className="jazz">hi</TagLabel>);
  expect(tag.is('.baz')).toBe(true);
  expect(tagLabel.is('.jazz')).toBe(true);
});

test('passes arbitrary props through', () => {
  const tag = shallow(<Tag data-foo="true">bye</Tag>);
  const tagLabel = shallow(<TagLabel data-bar="yes">hi</TagLabel>);
  expect(tag.is('[data-foo="true"]')).toBe(true);
  expect(tagLabel.is('[data-bar="yes"]')).toBe(true);
});

test('renders dismiss variant', () => {
  const tag = shallow(<Tag variant="dismiss">bye</Tag>);

  expect(tag.find('button').exists());
  expect(tag.find('.Tag--dismiss').exists());
  expect(tag.find('.Icon--close').exists());
});

test('handles onDismiss', async () => {
  const onDismissSpy = spy();
  const tag = mount(
    <Tag variant="dismiss" onDismiss={onDismissSpy}>
      bye
    </Tag>
  );

  tag.find('button').simulate('click');
  await new Promise(resolve => setImmediate(resolve));
  tag.update();

  expect(tag.find('Tag--hidden').exists());
  expect(onDismissSpy.calledOnce);
});

test('renders toggle variant', () => {
  const tag = shallow(
    <Tag
      variant="toggle"
      buttonLabel="toggle tag"
      toggleValue={true}
      onToggle={() => null}
    >
      bye
    </Tag>
  );

  expect(tag.find('button').exists());
  expect(tag.find('.Tag--toggle').exists());
  expect(tag.find('.Tag--toggle').prop('aria-label')).toBe('toggle tag');
  expect(tag.find('.Tag--toggle').prop('role')).toBe('switch');
  expect(tag.find('.Tag--toggle').prop('aria-checked')).toBe(true);
  expect(tag.find('.Tag--toggle span').text()).toBe('ON');
});

test('handles onToggle', async () => {
  const onToggleSpy = spy();
  const tag = mount(
    <Tag
      variant="toggle"
      buttonLabel="toggle tag"
      toggleValue={true}
      onToggle={onToggleSpy}
    >
      bye
    </Tag>
  );

  expect(tag.find('.Tag--toggle span').text()).toBe('ON');

  tag.find('.Tag--toggle').simulate('click');
  await new Promise(resolve => setImmediate(resolve));
  tag.update();

  expect(onToggleSpy.calledOnce);
});

test('should return no axe violations', async () => {
  const tag = shallow(
    <Tag>
      <TagLabel>Label:</TagLabel> value
    </Tag>
  );
  expect(await axe(tag.html())).toHaveNoViolations();
});
