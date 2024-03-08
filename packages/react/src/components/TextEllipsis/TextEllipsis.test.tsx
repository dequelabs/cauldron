import React, { createRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import axe from '../../axe';
import { createSandbox } from 'sinon';
import TextEllipsis from './';

const sandbox = createSandbox();

beforeEach(() => {
  global.ResizeObserver = global.ResizeObserver || (() => null);
  sandbox.stub(global, 'ResizeObserver').callsFake((callback) => {
    callback();
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
  render(<TextEllipsis>Hello World</TextEllipsis>);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('should not display tooltip with no overflow', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(100);
  render(<TextEllipsis>Hello World</TextEllipsis>);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('should display tooltip with overflow', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(200);
  render(<TextEllipsis>Hello World</TextEllipsis>);

  const button = screen.queryByRole('button') as HTMLButtonElement;
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('aria-disabled', 'true');
  act(() => {
    button.focus();
  });
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
});

test('should not display tooltip with no multiline overflow', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(100);
  render(<TextEllipsis maxLines={2}>Hello World</TextEllipsis>);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('should display tooltip with multiline overflow', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(200);
  render(<TextEllipsis maxLines={2}>Hello World</TextEllipsis>);

  const button = screen.queryByRole('button') as HTMLButtonElement;
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('aria-disabled', 'true');
  act(() => {
    button.focus();
  });
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <TextEllipsis data-testid="text-ellipsis" className="bananas">
      Hello World
    </TextEllipsis>
  );
  expect(screen.getByTestId('text-ellipsis')).toHaveClass(
    'TextEllipsis',
    'bananas'
  );
});

test('should support ref prop', () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <TextEllipsis data-testid="text-ellipsis" ref={ref}>
      Hello World
    </TextEllipsis>
  );
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(screen.getByTestId('text-ellipsis')).toEqual(ref.current);
});

test('should support as prop', () => {
  const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
    ({ children }, ref) => <button ref={ref}>{children}</button>
  );
  render(<TextEllipsis as={Button}>Hello World</TextEllipsis>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('should return no axe violations', async () => {
  render(<TextEllipsis data-testid="text-ellipsis">Hello World</TextEllipsis>);
  const results = await axe(screen.getByTestId('text-ellipsis'));
  expect(results).toHaveNoViolations();
});
