import React from 'react';
import { shallow } from 'enzyme';
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
