import React from 'react';
import { shallow, mount } from 'enzyme';
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

test('should return no axe violations', async () => {
  const tag = shallow(
    <Tag>
      <TagLabel>Label:</TagLabel> value
    </Tag>
  );
  expect(await axe(tag.html())).toHaveNoViolations();
});
