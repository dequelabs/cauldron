import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

test('should call onSelect when menuitem is clicked', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu {...defaultMenuProps}>
      <OptionsMenuItem onSelect={onSelect}>option 1</OptionsMenuItem>
    </OptionsMenu>
  );

  fireEvent.click(screen.getByRole('menuitem'));

  expect(onSelect).toBeCalled();
});

test('should not call onSelect when menuitem is disabled', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu {...defaultMenuProps}>
      <OptionsMenuItem onSelect={onSelect} disabled>
        option 1
      </OptionsMenuItem>
    </OptionsMenu>
  );

  fireEvent.click(screen.getByRole('menuitem'));

  expect(onSelect).not.toBeCalled();
});

test('should return no axe violations', async () => {
  const onSelect = jest.fn();

  const { container } = render(
    <OptionsMenu {...defaultMenuProps}>
      <OptionsMenuItem onSelect={onSelect}>option 1</OptionsMenuItem>
      <OptionsMenuItem onSelect={onSelect}>option 2</OptionsMenuItem>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});
