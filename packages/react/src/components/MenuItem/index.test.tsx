import React from 'react';
import sinon from 'sinon';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuItem from '../MenuItem';
import { axe } from 'jest-axe';

const user = userEvent.setup();

test('clicks first direct child link given a click', async () => {
  const onClick = sinon.spy();
  // Note: Using a hash link instead of a url link because jsdom doesn't correctly
  // support navigation and throws a noisy console error we don't care about
  render(
    <MenuItem>
      <a href="#foo" onClick={onClick}>
        Foo
      </a>
    </MenuItem>
  );

  expect(onClick.calledOnce).toBeFalsy();
  await user.click(screen.getByRole('link', { name: 'Foo' }));
  expect(onClick.calledOnce).toBeTruthy();
});

test('calls onClick prop', async () => {
  const onClick = sinon.spy();
  render(<MenuItem onClick={onClick}>BOOGNISH</MenuItem>);

  await user.click(screen.getByText('BOOGNISH'));
  expect(onClick.calledOnce).toBeTruthy();
});

test('clicks the menuitem given enter/space keydowns', async () => {
  const onClick = sinon.spy();
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
    }
  };

  render(
    <MenuItem onClick={onClick} onKeyDown={handleKeyDown}>
      <div role="button" tabIndex={0}>
        BOOGNISH
      </div>
    </MenuItem>
  );

  const menuItem = screen.getByText('BOOGNISH');

  expect(menuItem).not.toBeNull();

  await user.type(menuItem, '{enter}');
  await user.type(menuItem, '{space}');

  expect(onClick.calledTwice).toBeTruthy();
});

test('supports menuItemRef props', () => {
  const ref = sinon.spy();
  render(<MenuItem menuItemRef={ref}>BOOGNISH</MenuItem>);
  expect(ref.calledOnce).toBeTruthy();
});

test('should return no axe violations', async () => {
  const { container } = render(
    <ul role="menubar">
      <MenuItem>Foo</MenuItem>
    </ul>
  );
  await waitFor(() => {
    expect(container).toBeInTheDocument();
  });
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
