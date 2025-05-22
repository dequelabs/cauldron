import React, { createRef } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import axe from '../../axe';
import { createSandbox } from 'sinon';
import TextEllipsis from './';

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
  render(<TextEllipsis>Hello World</TextEllipsis>);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('should not display tooltip with no overflow', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(100);
  render(<TextEllipsis data-testid="text-ellipsis">Hello World</TextEllipsis>);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.getByTestId('text-ellipsis')).not.toHaveAttribute('tabindex');
});

test('should display tooltip with overflow', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(200);
  render(<TextEllipsis>Hello World</TextEllipsis>);

  const button = screen.queryByRole('button') as HTMLButtonElement;
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('tabindex', '0');
  expect(button).toHaveAttribute('aria-disabled', 'true');
  act(() => {
    button.focus();
  });
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();
});

test('should not display tooltip with no multiline overflow', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(100);
  render(
    <TextEllipsis data-testid="text-ellipsis" maxLines={2}>
      Hello World
    </TextEllipsis>
  );
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.getByTestId('text-ellipsis')).not.toHaveAttribute('tabindex');
});

test('should display tooltip with multiline overflow', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(200);
  render(<TextEllipsis maxLines={2}>Hello World</TextEllipsis>);

  const button = screen.queryByRole('button') as HTMLButtonElement;
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('tabindex', '0');
  expect(button).toHaveAttribute('aria-disabled', 'true');
  act(() => {
    button.focus();
  });
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();
});

test('should not show tooltip when `hideTooltip` is set to true', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(200);
  render(<TextEllipsis hideTooltip>Hello World</TextEllipsis>);

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('should not show tooltip with multiline when `hideTooltip` is set to true', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(200);
  render(
    <TextEllipsis maxLines={2} hideTooltip>
      Hello World
    </TextEllipsis>
  );

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
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
  type P = React.PropsWithChildren<{
    foo: string;
  }> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;
  const Link = React.forwardRef<HTMLAnchorElement, P>(
    ({ children, ...props }, ref) => (
      <a ref={ref} {...props}>
        {children}
      </a>
    )
  );
  render(
    <TextEllipsis as={Link} href="/somewhere" foo="bar">
      Hello World
    </TextEllipsis>
  );
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link')).toBeInTheDocument();
});

test('should call onOverFlowChange with true when overflowing', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(100);
  const onOverflowChange = jest.fn();
  render(
    <TextEllipsis onOverflowChange={onOverflowChange}>Hello World</TextEllipsis>
  );

  waitFor(() => {
    expect(onOverflowChange).toBeCalledWith(true);
  });
});

test('should call onOverFlowChange with false when not overflowing', () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(200);
  const onOverflowChange = jest.fn();
  render(
    <TextEllipsis onOverflowChange={onOverflowChange}>Hello World</TextEllipsis>
  );

  waitFor(() => {
    expect(onOverflowChange).toBeCalledWith(false);
  });
});

test('should return no axe violations', async () => {
  render(<TextEllipsis data-testid="text-ellipsis">Hello World</TextEllipsis>);
  const results = await axe(screen.getByTestId('text-ellipsis'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when text has ellipsis', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientWidth').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollWidth').value(200);
  render(<TextEllipsis>Hello World</TextEllipsis>);
  const results = await axe(screen.getByRole('button'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when text has multiline ellipsis', async () => {
  sandbox.stub(global.HTMLDivElement.prototype, 'clientHeight').value(100);
  sandbox.stub(global.HTMLDivElement.prototype, 'scrollHeight').value(200);
  render(<TextEllipsis maxLines={2}>Hello World</TextEllipsis>);
  const results = await axe(screen.getByRole('button'));
  expect(results).toHaveNoViolations();
});
