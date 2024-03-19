import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { createSandbox } from 'sinon';
import Code from './';

const sandbox = createSandbox();

beforeEach(() => {
  global.ResizeObserver = global.ResizeObserver || (() => null);
  sandbox.stub(global, 'ResizeObserver').callsFake((listener) => {
    listener();
    return {
      observe: sandbox.stub(),
      disconnect: sandbox.stub()
    };
  });
});

afterEach(() => {
  sandbox.restore();
});

test('should render Code block', () => {
  const { container } = render(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );
  expect(container.querySelector('pre')).toHaveClass('Code');
  expect(container.querySelector('pre')).not.toHaveClass('Code--scrollable');
  expect(container.querySelector('pre')).toHaveTextContent(
    'var some = "javascript"'
  );
});

test('should set tabIndex when element is scrollable', () => {
  // Mock the specific state expected when the tab should be scrollable
  sandbox.stub(global.HTMLPreElement.prototype, 'clientWidth').value(123);
  sandbox.stub(global.HTMLPreElement.prototype, 'scrollWidth').value(456);

  const { container } = render(
    <Code language="javascript" scrollable>{`var some = "javascript"`}</Code>
  );
  expect(container.querySelector('pre')).toHaveClass('Code--scrollable');
  expect(container.querySelector('pre')).toHaveAttribute('tabIndex', '0');
});

test('should not set tabIndex when element is not scrollable', () => {
  // Mock the specific state expected when the tab should not be scrollable
  sandbox.stub(global.HTMLPreElement.prototype, 'clientWidth').value(123);
  sandbox.stub(global.HTMLPreElement.prototype, 'scrollWidth').value(123);

  const { container } = render(
    <Code language="javascript" scrollable>{`var some = "javascript"`}</Code>
  );
  expect(container.querySelector('pre')).toHaveClass('Code--scrollable');
  expect(container.querySelector('pre')).not.toHaveAttribute('tabIndex');
});

test('should support className prop', () => {
  const { container } = render(
    <Code
      language="javascript"
      className="bananas"
    >{`var some = "javascript"`}</Code>
  );
  expect(container.querySelector('pre')).toHaveClass('Code', 'bananas');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Code language="javascript">{`var some = "javascript"`}</Code>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when scrollable', async () => {
  // Mock the specific state expected when the tab should be scrollable
  sandbox.stub(global.HTMLPreElement.prototype, 'clientWidth').value(123);
  sandbox.stub(global.HTMLPreElement.prototype, 'scrollWidth').value(456);

  const { container } = render(
    <Code language="javascript" scrollable>{`var some = "javascript"`}</Code>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
