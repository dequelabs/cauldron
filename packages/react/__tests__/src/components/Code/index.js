import React from 'react';
import { shallow, mount } from 'enzyme';
import Code from 'src/components/Code';
import axe from '../../../axe';

test('should render a <code> block', () => {
  const code = shallow(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );
  expect(code.contains('code'));
});

test('should return no axe violations', async () => {
  const code = shallow(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );
  expect(await axe(code.html())).toHaveNoViolations();
});

test('should be focusable when tabIndex is set to 0', () => {
  const code = mount(
    <Code language="javascript" tabIndex={0}>{`var some = "javascript"`}</Code>
  );

  const pre = code.find('pre').getDOMNode();
  pre.focus();
  expect(document.activeElement).toBe(pre);
});

test('should not be focusable when tabindex is not set', () => {
  const code = mount(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );

  const pre = code.find('pre').getDOMNode();
  pre.focus();
  expect(document.activeElement).not.toBe(pre);
});
