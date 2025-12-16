import React, { createRef } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import axe from '../../axe';
import { createSandbox } from 'sinon';
import TreeView from '.';

const sandbox = createSandbox();

beforeEach(() => {
  global.ResizeObserver = global.ResizeObserver || (() => null);
  sandbox.stub(global, 'ResizeObserver').callsFake((callback) => {
    callback([]);
    return {
      observe: sandbox.stub(),
      disconnect: sandbox.stub()
    };
  });
  sandbox.stub(global, 'requestAnimationFrame').callsFake((callback) => {
    callback(1);
    return 1;
  });
});

afterEach(() => {
  sandbox.restore();
});

test('should render children', () => {
  render(<TreeView>Hello World</TreeView>);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
