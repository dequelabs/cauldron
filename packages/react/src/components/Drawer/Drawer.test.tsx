import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drawer from './';
import axe from '../../axe';

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

test('should render children', () => {
  render(
    <Drawer position="left" open data-testid="drawer">
      Hello World
    </Drawer>
  );
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <Drawer position="left" className="bananas" open data-testid="drawer">
      Children
    </Drawer>
  );
  expect(screen.getByTestId('drawer')).toHaveClass('Drawer', 'bananas');
});

test('should support open prop', () => {
  const { rerender } = render(
    <Drawer position="left" data-testid="drawer">
      Children
    </Drawer>
  );
  const drawer = screen.getByTestId('drawer');

  expect(drawer).not.toHaveClass('Drawer--open');
  expect(drawer).not.toBeVisible();
  rerender(
    <Drawer position="left" data-testid="drawer" open>
      Children
    </Drawer>
  );
  expect(drawer).toHaveClass('Drawer--open');
  expect(drawer).toBeVisible();
});

test('should support position prop', () => {
  const classes: Record<
    React.ComponentProps<typeof Drawer>['position'],
    string
  > = {
    top: 'Drawer--top',
    right: 'Drawer--right',
    bottom: 'Drawer--bottom',
    left: 'Drawer--left'
  };
  const { rerender } = render(
    <Drawer position="top" open data-testid="drawer">
      Children
    </Drawer>
  );

  expect.assertions(8);

  for (const [position, className] of Object.entries(classes)) {
    rerender(
      <Drawer
        position={position as React.ComponentProps<typeof Drawer>['position']}
        data-testid="drawer"
      >
        Children
      </Drawer>
    );
    expect(screen.getByTestId('drawer')).toHaveClass(className);
    expect(screen.getByTestId('drawer')).not.toHaveClass(
      ...Object.entries(classes)
        .filter(([key]) => key !== position)
        .map(([, className]) => className)
    );
  }
});

test('should call onClose prop on esc keypress', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  render(
    <Drawer position="left" data-testid="drawer" open onClose={onClose}>
      Children
    </Drawer>
  );

  expect(onClose).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

test('should call onClose prop on click outside', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  render(
    <Drawer position="left" data-testid="drawer" open onClose={onClose}>
      Children
    </Drawer>
  );

  expect(onClose).not.toHaveBeenCalled();
  await user.click(document.body);
  expect(onClose).toHaveBeenCalled();
});

test('should set focus to drawer by default when opened', () => {
  const { rerender } = render(
    <Drawer position="left" data-testid="drawer">
      Children
    </Drawer>
  );

  expect(screen.getByTestId('drawer')).not.toHaveFocus();
  rerender(
    <Drawer position="left" data-testid="drawer" open>
      Children
    </Drawer>
  );
  expect(screen.getByTestId('drawer')).toHaveFocus();
});

test('should set focus to focusable element when opened', () => {
  const { rerender } = render(
    <Drawer position="left" data-testid="drawer">
      <button>focus me</button>
    </Drawer>
  );
  // button is initially hidden, but we can still get it to ensure it has focus
  const button = screen.getByRole('button', { hidden: true });

  rerender(
    <Drawer
      position="left"
      data-testid="drawer"
      open
      focusOptions={{
        initialFocus: button
      }}
    >
      <button>focus me</button>
    </Drawer>
  );
  expect(screen.getByTestId('drawer')).not.toHaveFocus();
  expect(button).toHaveFocus();
});

test('should set focus to custom element when opened', () => {
  const { rerender } = render(
    <Drawer position="left" data-testid="drawer">
      <button>focus me</button>
    </Drawer>
  );

  rerender(
    <Drawer position="left" data-testid="drawer" open>
      <button>focus me</button>
    </Drawer>
  );
  expect(screen.getByTestId('drawer')).not.toHaveFocus();
  expect(screen.getByRole('button', { name: 'focus me' })).toHaveFocus();
});

test('should set focus to custom ref element', () => {
  const ref = React.createRef<HTMLButtonElement>();
  const { rerender } = render(
    <Drawer position="left" data-testid="drawer">
      <button ref={ref}>focus me</button>
    </Drawer>
  );

  rerender(
    <Drawer position="left" data-testid="drawer" open>
      <button ref={ref}>focus me</button>
    </Drawer>
  );
  expect(screen.getByTestId('drawer')).not.toHaveFocus();
  expect(ref.current).toHaveFocus();
});

test('should return focus to triggering element when closed', () => {
  const { rerender } = render(
    <>
      <button>trigger</button>
      <Drawer position="left" data-testid="drawer">
        Children
      </Drawer>
    </>
  );

  // ensure the trigger element is initially focused
  screen.getByRole('button', { name: 'trigger' }).focus();

  rerender(
    <>
      <button>trigger</button>
      <Drawer position="left" data-testid="drawer" open>
        Children
      </Drawer>
    </>
  );
  rerender(
    <>
      <button>trigger</button>
      <Drawer position="left" data-testid="drawer">
        Children
      </Drawer>
    </>
  );

  expect(screen.getByRole('button', { name: 'trigger' })).toHaveFocus();
});

test('should return focus to custom element when closed', () => {
  const button = document.createElement('button');
  document.body.appendChild(button);

  const { rerender } = render(
    <Drawer
      position="left"
      data-testid="drawer"
      focusOptions={{ returnFocus: button }}
    >
      Children
    </Drawer>
  );
  rerender(
    <Drawer
      position="left"
      data-testid="drawer"
      open
      focusOptions={{ returnFocus: button }}
    >
      Children
    </Drawer>
  );
  rerender(
    <Drawer
      position="left"
      data-testid="drawer"
      focusOptions={{ returnFocus: button }}
    >
      Children
    </Drawer>
  );

  expect(button).toHaveFocus();
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Drawer position="left" open ref={ref} data-testid="drawer">
      Children
    </Drawer>
  );

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.getByTestId('drawer'));
});

test('should not trap focus when modal is falsy', async () => {
  const user = userEvent.setup();
  render(
    <>
      <button>outside</button>
      <Drawer position="left" open modal={false}>
        <div>
          <button>inside</button>
        </div>
      </Drawer>
    </>
  );

  expect(screen.getByRole('button', { name: 'outside' })).not.toHaveAttribute(
    'aria-hidden',
    'true'
  );
  await user.keyboard('{Tab}');
  expect(document.body).toHaveFocus();
  await user.keyboard('{Tab}');
  expect(screen.getByRole('button', { name: 'outside' })).toHaveFocus();
  await user.keyboard('{Tab}');
  expect(screen.getByRole('button', { name: 'inside' })).toHaveFocus();
});

test('should return no axe violations when open', async () => {
  render(
    <Drawer position="left" open data-testid="drawer">
      Children
    </Drawer>
  );

  const results = await axe(screen.getByTestId('drawer'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when closed', async () => {
  render(
    <Drawer position="left" data-testid="drawer">
      Children
    </Drawer>
  );

  const results = await axe(screen.getByTestId('drawer'));
  expect(results).toHaveNoViolations();
});
