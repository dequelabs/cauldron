import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import CopyButton from './';
import axe from '../../axe';

beforeEach(() => {
  jest.spyOn(global.document, 'execCommand');
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('should render copy button', () => {
  render(<CopyButton value="copy text" />);
  expect(screen.queryByRole('button', { name: 'Copy' })).toHaveClass(
    'Button--tertiary'
  );
});

test('should render copy button with children name', () => {
  render(<CopyButton value="copy text">Copy to clipboard</CopyButton>);
  expect(
    screen.queryByRole('button', { name: 'Copy to clipboard' })
  ).toBeInTheDocument();
});

test('should render copy button with accessible name when `hideVisibleLabel` is set', () => {
  render(<CopyButton value="copy text" hideVisibleLabel />);
  expect(screen.queryByRole('button', { name: 'Copy' })).toHaveClass(
    'Button--tertiary'
  );
});

test('should copy text using `navigator.clipboard` api', async () => {
  const user = userEvent.setup();
  const clipboardWriteText = jest.spyOn(
    global.navigator.clipboard,
    'writeText'
  );
  render(<CopyButton value="copy text" />);

  expect(clipboardWriteText).not.toBeCalled();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(clipboardWriteText).toBeCalledTimes(1);
  expect(clipboardWriteText).toBeCalledWith('copy text');
  expect(global.document.execCommand).not.toBeCalled();
});

test('should copy text using `execCommand` api', async () => {
  const user = userEvent.setup();
  // @ts-expect-error need to mock when the clipboard api is unavailable
  jest.spyOn(global, 'navigator', 'get').mockReturnValue({});
  render(<CopyButton value="copy text" />);

  expect(global.document.execCommand).not.toBeCalled();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(global.document.execCommand).toBeCalledTimes(1);
  expect(global.document.execCommand).toBeCalledWith('copy text');
});

test('should show visible tooltip after copy action', async () => {
  const user = userEvent.setup();
  render(<CopyButton value="copy text" />);

  expect(
    screen.queryByRole('tooltip', { name: 'Copied' })
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  await waitFor(() => {
    expect(
      screen.queryByRole('tooltip', { name: 'Copied' })
    ).toBeInTheDocument();
  });
});

test('should show visible tooltip with notificationLabel after copy action', async () => {
  const user = userEvent.setup();
  render(
    <CopyButton value="copy text" notificationLabel="Copied to clipboard!" />
  );

  expect(
    screen.queryByRole('tooltip', { name: 'Copied to clipboard!' })
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  await waitFor(() => {
    expect(
      screen.queryByRole('tooltip', { name: 'Copied to clipboard!' })
    ).toBeInTheDocument();
  });
});

test('should announce copy action', async () => {
  const user = userEvent.setup();
  render(<CopyButton value="copy text" />);

  expect(
    screen.queryByText('Copied', { selector: '.Offscreen' })
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  await waitFor(() => {
    // Note: these aren't very RTL like, but there's not clean way to test for aria-live announcements with RTL
    expect(
      screen.queryByText('Copied', { selector: '.Offscreen' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Copied', { selector: '.Offscreen' })
    ).toHaveAttribute('aria-live', 'polite');
  });
});

test('should announce copy action with notificationLabel', async () => {
  const user = userEvent.setup();
  render(
    <CopyButton value="copy text" notificationLabel="Copied to clipboard!" />
  );

  expect(
    screen.queryByText('Copied to clipboard!', { selector: '.Offscreen' })
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  await waitFor(() => {
    // Note: these aren't very RTL like, but there's not clean way to test for aria-live announcements with RTL
    expect(
      screen.queryByText('Copied to clipboard!', { selector: '.Offscreen' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Copied to clipboard!', { selector: '.Offscreen' })
    ).toHaveAttribute('aria-live', 'polite');
  });
});

test('should call "onCopy" after copy action', async () => {
  const onCopy = jest.fn();
  const user = userEvent.setup();
  render(<CopyButton value="copy text" onCopy={onCopy} />);

  expect(onCopy).not.toBeCalled();
  await user.click(screen.getByRole('button', { name: 'Copy' }));
  expect(onCopy).toBeCalledTimes(1);
  expect(onCopy).toBeCalledWith('copy text');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <>
      <CopyButton value="copy" />
    </>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when `hideVisibleLabel` is set', async () => {
  const { container } = render(
    <>
      <CopyButton value="copy" hideVisibleLabel />
    </>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when copied', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <>
      <CopyButton value="copy" hideVisibleLabel />
    </>
  );
  await user.click(screen.getByRole('button', { name: 'Copy' }));

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
