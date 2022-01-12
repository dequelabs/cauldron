import React from 'react';
import { shallow } from 'enzyme';
import FieldWrap from 'src/components/FieldWrap';
import axe from '../../../axe';

test('should return no axe violations', async () => {
  const wrap = shallow(<FieldWrap>foo</FieldWrap>);
  expect(await axe(wrap.html())).toHaveNoViolations();
});

test('is polymorphic', () => {
  const wrap = shallow(<FieldWrap as="section">foo</FieldWrap>);
  expect(wrap.is('section')).toBe(true);
});

test('sets provided className and spreads props through', () => {
  const wrap = shallow(
    <FieldWrap className="foo" role="radiogroup">
      foo
    </FieldWrap>
  );
  expect(wrap.hasClass('foo')).toBe(true);
  expect(wrap.is('[role="radiogroup"]')).toBe(true);
});
