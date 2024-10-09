import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomSheet from './';
import axe from '../../axe';

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

test('should render label', () => {
  render(
    <BottomSheet label="Title" open>
      Children
    </BottomSheet>
  );
  expect(screen.getByText('Title')).toBeInTheDocument();
});

test('should render children', () => {
  render(
    <BottomSheet label="Title" open>
      Hello World
    </BottomSheet>
  );
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <BottomSheet label="Title" className="bananas" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );
  expect(screen.getByTestId('bottomsheet').firstElementChild).toHaveClass(
    'BottomSheet',
    'bananas'
  );
});

test('should support open prop', () => {
  const { rerender } = render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );
  const bottomsheet = screen.getByTestId('bottomsheet');

  expect(bottomsheet).not.toHaveClass('Drawer--open');
  expect(bottomsheet).not.toBeVisible();
  rerender(
    <BottomSheet label="Title" data-testid="bottomsheet" open>
      Children
    </BottomSheet>
  );
  expect(bottomsheet).toHaveClass('Drawer--open');
  expect(bottomsheet).toBeVisible();
});

test('should call onClose prop on esc keypress', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  render(
    <BottomSheet label="Title" open onClose={onClose}>
      Children
    </BottomSheet>
  );

  expect(onClose).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

test('should call onClose prop on click outside', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  render(
    <BottomSheet label="Title" open onClose={onClose}>
      Children
    </BottomSheet>
  );

  expect(onClose).not.toHaveBeenCalled();
  await user.click(document.body);
  expect(onClose).toHaveBeenCalled();
});

test('should set focus to bottom sheet by default when opened', () => {
  const { rerender } = render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  expect(screen.getByTestId('bottomsheet')).not.toHaveFocus();
  rerender(
    <BottomSheet label="Title" open data-testid="bottomsheet">
      Children
    </BottomSheet>
  );
  expect(screen.getByTestId('bottomsheet').firstElementChild).toHaveFocus();
});

test('should set focus to focusable element when opened', () => {
  const { rerender } = render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      <button>focus me</button>
    </BottomSheet>
  );
  // button is initially hidden, but we can still get it to ensure it has focus
  const button = screen.getAllByRole('button', { hidden: true })[1];

  rerender(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      open
      focusOptions={{
        initialFocus: button
      }}
    >
      <button>focus me</button>
    </BottomSheet>
  );
  expect(screen.getByTestId('bottomsheet')).not.toHaveFocus();
  expect(button).toHaveFocus();
});

test('should set focus to custom element when opened', () => {
  const ref = React.createRef<HTMLButtonElement>();
  const { rerender } = render(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      focusOptions={{ initialFocus: ref.current as HTMLElement }}
    >
      <button>no focus me</button>
      <button ref={ref}>focus me</button>
    </BottomSheet>
  );

  rerender(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      focusOptions={{ initialFocus: ref.current as HTMLElement }}
      open
    >
      <button>no focus me</button>
      <button ref={ref}>focus me</button>
    </BottomSheet>
  );
  expect(screen.getByTestId('bottomsheet')).not.toHaveFocus();
  expect(screen.getByRole('button', { name: 'focus me' })).toHaveFocus();
});

test('should set focus to custom ref element', () => {
  const ref = React.createRef<HTMLButtonElement>();
  const { rerender } = render(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      focusOptions={{ initialFocus: ref }}
    >
      <button>no focus me</button>
      <button ref={ref}>focus me</button>
    </BottomSheet>
  );

  rerender(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      focusOptions={{ initialFocus: ref }}
      open
    >
      <button>no focus me</button>
      <button ref={ref}>focus me</button>
    </BottomSheet>
  );
  expect(screen.getByTestId('bottomsheet')).not.toHaveFocus();
  expect(ref.current).toHaveFocus();
});

test('should return focus to triggering element when closed', () => {
  const { rerender } = render(
    <>
      <button>trigger</button>
      <BottomSheet label="title" data-testid="bottomsheet">
        Children
      </BottomSheet>
    </>
  );

  // ensure the trigger element is initially focused
  screen.getByRole('button', { name: 'trigger' }).focus();

  rerender(
    <>
      <button>trigger</button>
      <BottomSheet label="title" data-testid="bottomsheet" open>
        Children
      </BottomSheet>
    </>
  );
  rerender(
    <>
      <button>trigger</button>
      <BottomSheet label="title" data-testid="bottomsheet">
        Children
      </BottomSheet>
    </>
  );

  expect(screen.getByRole('button', { name: 'trigger' })).toHaveFocus();
});

test('should return focus to custom element when closed', () => {
  const button = document.createElement('button');
  document.body.appendChild(button);

  const { rerender } = render(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      focusOptions={{ returnFocus: button }}
    >
      Children
    </BottomSheet>
  );
  rerender(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      open
      focusOptions={{ returnFocus: button }}
    >
      Children
    </BottomSheet>
  );
  rerender(
    <BottomSheet
      label="Title"
      data-testid="bottomsheet"
      focusOptions={{ returnFocus: button }}
    >
      Children
    </BottomSheet>
  );

  expect(button).toHaveFocus();
});

test('should support ref prop', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <BottomSheet label="Title" open ref={ref} data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(
    screen.getByTestId('bottomsheet').firstElementChild
  );
});

test('should return no axe violations when open', async () => {
  render(
    <BottomSheet label="Title" open data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  const results = await axe(screen.getByTestId('bottomsheet'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when closed', async () => {
  render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  const results = await axe(screen.getByTestId('bottomsheet'));
  expect(results).toHaveNoViolations();
});
