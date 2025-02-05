import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import OptionsMenu from './';
import axe from '../../axe';

const trigger = (props: React.HTMLAttributes<HTMLButtonElement>) => (
  <button type="button" {...props}>
    trigger
  </button>
);

test('should render menu', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(screen.queryByRole('menu')).toHaveClass('OptionsMenu__list');
});

test('should render children', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.queryAllByRole('menuitem')).toHaveLength(2);
});

test('should render trigger prop', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument();
});

test('should support className prop', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger} className="bananas">
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.queryByRole('menu')?.parentElement).toHaveClass(
    'OptionsMenu bananas'
  );
});

test('should support align prop', () => {
  const onSelect = jest.fn();

  render(
    <>
      <OptionsMenu onSelect={onSelect} trigger={trigger} align="left">
        <li>option 1</li>
        <li>option 2</li>
      </OptionsMenu>
      <OptionsMenu onSelect={onSelect} trigger={trigger} align="right">
        <li>option 1</li>
        <li>option 2</li>
      </OptionsMenu>
    </>
  );

  expect(screen.queryAllByRole('menu')[0]?.parentElement).toHaveClass(
    'OptionsMenu--align-left'
  );
  expect(screen.queryAllByRole('menu')[1]?.parentElement).toHaveClass(
    'OptionsMenu--align-right'
  );
});

test('should support menuRef prop', () => {
  const menuRef = React.createRef<HTMLUListElement>();
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger} menuRef={menuRef}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(menuRef.current).toBeTruthy();
  expect(menuRef.current).toEqual(screen.getByRole('menu'));
});

test('should toggle menu on trigger clicks', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = screen.getByRole('button', { name: 'trigger' });

  await user.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).toHaveClass('OptionsMenu--expanded');
  await user.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('menu')).not.toHaveClass('OptionsMenu--expanded');
});

test('should click trigger with down key on trigger', () => {
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = screen.getByRole('button');

  fireEvent.keyDown(button, { keyCode: 40 });
  expect(button).toHaveAttribute('aria-expanded', 'true');
});

test('should focus trigger on close', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = screen.getByRole('button');

  await user.click(button); // opens menu
  await user.click(button); // closes menu
  expect(button).toHaveFocus();
});

test('should call onClose when closed', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  const onSelect = jest.fn();

  render(
    <OptionsMenu onSelect={onSelect} trigger={trigger} onClose={onClose}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const option = screen.getByRole('menuitem');

  await user.click(option);

  expect(onClose).toBeCalled();
});

test('should close menu when click outside event occurs', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();

  render(
    <>
      <button>Click me!</button>
      <OptionsMenu onSelect={onSelect} trigger={trigger}>
        <li className="foo">option 1</li>
      </OptionsMenu>
    </>
  );

  const triggerButton = screen.getByRole('button', { name: 'trigger' });
  await user.click(triggerButton);
  expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
  await user.click(screen.getByRole('button', { name: 'Click me!' }));
  expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('menu')).not.toHaveClass('OptionsMenu--expanded');
});

test('should return no axe violations when hidden', async () => {
  const onSelect = jest.fn();
  const { container } = render(
    <OptionsMenu onSelect={onSelect} trigger={trigger} show={false}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations when shown', async () => {
  const onSelect = jest.fn();
  const { container } = render(
    <OptionsMenu onSelect={onSelect} trigger={trigger} show={true}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});
