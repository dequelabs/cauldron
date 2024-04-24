import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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
  render(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('should not render falsy children', () => {
  render(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      {false && <li>option 2</li>}
      <li>option 3</li>
    </OptionsMenuList>
  );

  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('should cycle through children', () => {
  render(
    <OptionsMenuList {...defaultProps} show={true}>
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
  render(
    <OptionsMenuList {...defaultProps} show={true}>
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
  render(
    <OptionsMenuList {...defaultProps} show={true}>
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
  render(
    <OptionsMenuList {...defaultProps} show={true}>
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
  render(
    <OptionsMenuList {...defaultProps} show={true}>
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

test('should call onClose when clicked outside', () => {
  render(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(document.body);

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
  render(
    <OptionsMenuList {...defaultProps}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  fireEvent.click(screen.getAllByRole('menuitem')[0]);

  expect(defaultProps.onClose).toBeCalled();
});

test('should not fire onClose when menu item is selected and default prevented', () => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true
  });

  event.preventDefault();

  render(
    <OptionsMenuList {...defaultProps}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  screen.getAllByRole('menuitem')[0].dispatchEvent(event);

  expect(defaultProps.onClose).not.toBeCalled();
});

test('should click child links with click events', () => {
  const onClick = jest.fn();

  render(
    <OptionsMenuList {...defaultProps}>
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

test('should focus child links with keydown events', () => {
  const onClick = jest.fn();
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    keyCode: enter,
    which: enter
  });

  render(
    <OptionsMenuList {...defaultProps}>
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

test('should return no axe violations', async () => {
  const { container } = render(
    <OptionsMenuList {...defaultProps} show={true}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations when closed', async () => {
  const { container } = render(
    <OptionsMenuList {...defaultProps} show={false}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenuList>
  );

  expect(await axe(container)).toHaveNoViolations();
});
