import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsMenu, { OptionsMenuItem } from './';
import axe from '../../axe';

const defaultMenuProps = {
  trigger: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLButtonElement> &
      React.ButtonHTMLAttributes<HTMLButtonElement>
  ) => (
    <button {...props} type="button">
      thingy
    </button>
  )
};

test('should call onSelect when menuitem is clicked', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();

  render(
    <OptionsMenu {...defaultMenuProps} onSelect={onSelect}>
      <OptionsMenuItem onSelect={onSelect}>option 1</OptionsMenuItem>
    </OptionsMenu>
  );

  await user.click(screen.getByRole('menuitem'));

  expect(onSelect).toBeCalled();
});

test('should not call onSelect when menuitem is disabled', async () => {
  const user = userEvent.setup();
  const menuOnSelect = jest.fn();
  const onSelect = jest.fn();

  render(
    <OptionsMenu {...defaultMenuProps} onSelect={menuOnSelect}>
      <OptionsMenuItem onSelect={onSelect} disabled>
        option 1
      </OptionsMenuItem>
    </OptionsMenu>
  );

  await user.click(screen.getByRole('menuitem'));

  expect(onSelect).not.toBeCalled();
});

test('should return no axe violations', async () => {
  const onSelect = jest.fn();

  const { container } = render(
    <OptionsMenu {...defaultMenuProps} onSelect={onSelect}>
      <OptionsMenuItem onSelect={onSelect}>option 1</OptionsMenuItem>
      <OptionsMenuItem onSelect={onSelect}>option 2</OptionsMenuItem>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});
