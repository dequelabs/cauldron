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

test('should have region and accessible name when tabIndex is set to 0', () => {
  const code = mount(
    <Code language="javascript" tabIndex={0}>{`var some = "javascript"`}</Code>
  );
  const props = code.find('pre').props();
  expect(props.role).toBe('region');
  expect(props['aria-label']).toBe('Code snippet');
});

test('should be able to set an accessible name with ariaLabel', () => {
  const code = mount(
    <Code
      language="javascript"
      tabIndex={0}
      ariaLabel="Javascript code snippet"
    >{`var some = "javascript"`}</Code>
  );
  const props = code.find('pre').props();
  expect(props.role).toBe('region');
  expect(props['aria-label']).toBe('Javascript code snippet');
});

test('should be able to set an accessible name with ariaLabelledBy', () => {
  const code = mount(
    <div>
      <h1 id="heading">Javascript code snippet</h1>
      <Code
        language="javascript"
        tabIndex={0}
        ariaLabelledBy="heading"
      >{`var some = "javascript"`}</Code>
    </div>
  );
  const props = code.find('pre').props();
  expect(props.role).toBe('region');
  expect(props['aria-labelledby']).toBe('heading');
});

test('should not be focusable when tabindex is not set', () => {
  const code = mount(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );

  const pre = code.find('pre').getDOMNode();
  pre.focus();
  expect(document.activeElement).not.toBe(pre);
});
