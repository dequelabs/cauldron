import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import OptionsMenuList from './';
import axe from '../../axe';

const [space, enter, down, esc, tab] = [32, 13, 40, 27, 9];
let defaultProps: { onClose: jest.Mock };

beforeEach(() => {
  defaultProps = {
    onClose: jest.fn()
  };
});

test('should render children', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('should not render falsy children', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      {false && <li>option 2</li>}
      <li>option 3</li>
    </OptionsMenuList>
  );

  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('should cycle through children', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: 'ArrowDown',
    keyCode: down,
    which: down
  });

  expect(screen.getAllByRole('menuitem')[1]).toHaveFocus();

  fireEvent.keyDown(screen.getAllByRole('menuitem')[1], {
    key: 'ArrowDown',
    keyCode: down,
    which: down
  });

  expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
});

test('should call onClose given enter keydown', () => {
  const onSelect = jest.fn();
  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: 'Enter',
    keyCode: enter,
    which: enter
  });

  expect(defaultProps.onClose).toBeCalled();
});

test('should call onClose given space keydown', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: ' ',
    keyCode: space,
    which: space
  });

  expect(defaultProps.onClose).toBeCalled();
});

test('should call onClose given escape keydown', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: 'Escape',
    keyCode: esc,
    which: esc
  });

  expect(defaultProps.onClose).toBeCalled();
});

test('should call onClose given tab keydown', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: 'Tab',
    keyCode: tab,
    which: tab
  });

  expect(defaultProps.onClose).toBeCalled();
});

test('should call onClose when clicked outside', async () => {
  const onSelect = jest.fn();
  const user = userEvent.setup();

  const { rerender } = render(
    <>
      <button data-testid="trigger">Trigger</button>
      <OptionsMenuList {...defaultProps} show={false} onSelect={onSelect}>
        <li>option 1</li>
        <li>option 2</li>
      </OptionsMenuList>
    </>
  );

  // Focus the trigger button
  const triggerButton = screen.getByTestId('trigger');
  triggerButton.focus();
  expect(triggerButton).toHaveFocus();

  // Rerender with show=true
  rerender(
    <>
      <button data-testid="trigger">Trigger</button>
      <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
        <li>option 1</li>
        <li>option 2</li>
      </OptionsMenuList>
    </>
  );

  // Simulate clicking outside
  await user.click(document.body);

  expect(defaultProps.onClose).toBeCalled();
});

test('should fire onSelect when menu item is clicked', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(screen.getAllByRole('menuitem')[0]);

  expect(onSelect).toBeCalled();
});

test('should fire onSelect when menu item is selected with space', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: ' ',
    keyCode: space,
    which: space
  });

  expect(onSelect).toBeCalled();
});

test('should fire onSelect when menu item is selected with enter', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.keyDown(screen.getAllByRole('menuitem')[0], {
    key: 'Enter',
    keyCode: enter,
    which: enter
  });

  expect(onSelect).toBeCalled();
});

test('should fire onClose when menu item is selected', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(screen.getAllByRole('menuitem')[0]);

  expect(defaultProps.onClose).toBeCalled();
});

test('should not fire onClose when menu item is selected and default prevented', () => {
  const onSelect = jest.fn();

  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });

  event.preventDefault();

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  screen.getAllByRole('menuitem')[0].dispatchEvent(event);

  expect(defaultProps.onClose).not.toBeCalled();
});

test('should click child links with click events', () => {
  const onSelect = jest.fn();
  const onClick = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>
        <a href="#foo" onClick={onClick}>
          Click me!
        </a>
      </li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(screen.getByRole('link'));

  expect(onClick).toBeCalledTimes(1);
});

test('should call onClick handler when Enter key is pressed on a link', () => {
  const onSelect = jest.fn();
  const onClick = jest.fn();
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    keyCode: enter,
    which: enter
  });

  render(
    <OptionsMenuList {...defaultProps} onSelect={onSelect}>
      <li>
        <a href="#foo" onClick={onClick}>
          Click me!
        </a>
      </li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(screen.getByRole('link'));
  fireEvent(screen.getByRole('link'), event);

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('should call onClose when an item is selected and closeOnSelect is true', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenuList {...defaultProps} closeOnSelect={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(screen.getAllByRole('menuitem')[0]);

  expect(defaultProps.onClose).toBeCalled();
});

test('should return no axe violations', async () => {
  const onSelect = jest.fn();
  const { container } = render(
    <OptionsMenuList {...defaultProps} show={true} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations when closed', async () => {
  const onSelect = jest.fn();
  const { container } = render(
    <OptionsMenuList {...defaultProps} show={false} onSelect={onSelect}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  expect(await axe(container)).toHaveNoViolations();
});
