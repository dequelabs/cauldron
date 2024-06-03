import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuItem from '../MenuItem';
import { axe } from 'jest-axe';

const user = userEvent.setup();

test('clicks first direct child link given a click', async () => {
  const onClick = sinon.spy();
  render(
    <MenuItem>
      <a href="/foo" onClick={onClick}>
        Foo
      </a>
    </MenuItem>
  );

  expect(onClick.calledOnce).toBeFalse();
  await user.click(screen.getByRole('link', { name: 'Foo' }));
  expect(onClick.calledOnce).toBeTruthy();
});

test('calls onClick prop', async () => {
  expect.assertions(1);
  let clicked = false;
  const click = () => (clicked = true);
  render(<MenuItem onClick={click}>BOOGNISH</MenuItem>);

  await user.click(screen.getByText('BOOGNISH'));
  expect(clicked).toBeTruthy();
});

test('clicks the menuitem given enter/space keydowns', async () => {
  expect.assertions(2);
  let clickCount = 0;

  const click = () => {
    clickCount += 1;
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      click();
    }
  };

  render(
    <MenuItem onClick={click} onKeyDown={handleKeyDown}>
      <div role="button" tabIndex={0}>
        BOOGNISH
      </div>
    </MenuItem>
  );

  const menuItem = screen.getByText('BOOGNISH');

  expect(menuItem).not.toBeNull();

  if (menuItem) {
    await user.type(menuItem, '{enter}');
    await user.type(menuItem, '{space}');
    expect(clickCount).toBe(3);
  }
});

test('supports menuItemRef props', () => {
  expect.assertions(1);
  let called = false;
  const ref = () => (called = true);
  render(<MenuItem menuItemRef={ref}>BOOGNISH</MenuItem>);
  expect(called).toBeTruthy();
});

test('should return no axe violations', async () => {
  const { container } = render(
    <ul role="menubar">
      <MenuItem>Foo</MenuItem>
    </ul>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
