import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomSheet from './';
import axe from '../../axe';

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

test('should render label', async () => {
  render(
    <BottomSheet label="Title" open>
      Children
    </BottomSheet>
  );
  const label = await screen.findByText('Title');
  expect(label).toBeInTheDocument();
});

test('should render children', async () => {
  render(
    <BottomSheet label="Title" open>
      Hello World
    </BottomSheet>
  );
  const content = await screen.findByText('Hello World');
  expect(content).toBeInTheDocument();
});

test('should support className prop', async () => {
  render(
    <BottomSheet label="Title" className="bananas" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );
  const bottomsheet = await screen.findByTestId('bottomsheet');
  expect(bottomsheet.firstElementChild).toHaveClass('BottomSheet', 'bananas');
});

test('should support open prop', async () => {
  const { rerender } = render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );
  const bottomsheet = await screen.findByTestId('bottomsheet');

  expect(bottomsheet).not.toHaveClass('Drawer--open');
  expect(bottomsheet).not.toBeVisible();

  rerender(
    <BottomSheet label="Title" data-testid="bottomsheet" open>
      Children
    </BottomSheet>
  );

  const openBottomsheet = await screen.findByTestId('bottomsheet');
  expect(openBottomsheet).toHaveClass('Drawer--open');
  expect(openBottomsheet).toBeVisible();
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

test('should set focus to bottom sheet by default when opened', async () => {
  const { rerender } = render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  const initialSheet = await screen.findByTestId('bottomsheet');
  expect(initialSheet).not.toHaveFocus();

  rerender(
    <BottomSheet label="Title" open data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  const openSheet = await screen.findByTestId('bottomsheet');
  expect(openSheet.firstElementChild).toHaveFocus();
});

test('should set focus to focusable element when opened', async () => {
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

  const sheet = await screen.findByTestId('bottomsheet');
  expect(sheet).not.toHaveFocus();
  expect(button).toHaveFocus();
});

test('should set focus to custom element when opened', async () => {
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

  const sheet = await screen.findByTestId('bottomsheet');
  const focusButton = await screen.findByRole('button', { name: 'focus me' });
  expect(sheet).not.toHaveFocus();
  expect(focusButton).toHaveFocus();
});

test('should set focus to custom ref element', async () => {
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

  const sheet = await screen.findByTestId('bottomsheet');
  expect(sheet).not.toHaveFocus();
  expect(ref.current).toHaveFocus();
});

test('should return focus to triggering element when closed', async () => {
  const { rerender } = render(
    <>
      <button>trigger</button>
      <BottomSheet label="title" data-testid="bottomsheet">
        Children
      </BottomSheet>
    </>
  );

  const trigger = await screen.findByRole('button', { name: 'trigger' });
  trigger.focus();

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

  const finalTrigger = await screen.findByRole('button', { name: 'trigger' });
  expect(finalTrigger).toHaveFocus();
});

test('should return focus to custom element when closed', async () => {
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

  waitFor(() => {
    expect(button).toHaveFocus();
  });
});

test('should support ref prop', async () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <BottomSheet label="Title" open ref={ref} data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  waitFor(async () => {
    const bottomsheet = await screen.findByTestId('bottomsheet');
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toEqual(bottomsheet.firstElementChild);
  });
});

test('should return no axe violations when open', async () => {
  render(
    <BottomSheet label="Title" open data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  const bottomsheet = await screen.findByTestId('bottomsheet');
  const results = await axe(bottomsheet);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when closed', async () => {
  render(
    <BottomSheet label="Title" data-testid="bottomsheet">
      Children
    </BottomSheet>
  );

  const bottomsheet = await screen.findByTestId('bottomsheet');
  const results = await axe(bottomsheet);
  expect(results).toHaveNoViolations();
});
