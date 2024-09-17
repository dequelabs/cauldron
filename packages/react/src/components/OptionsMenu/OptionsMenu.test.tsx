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
  render(
    <OptionsMenu trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(screen.queryByRole('menu')).toHaveClass('OptionsMenu__list');
});

test('should render children', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.queryAllByRole('menuitem')).toHaveLength(2);
});

test('should render trigger prop', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument();
});

test('should support className prop', () => {
  render(
    <OptionsMenu trigger={trigger} className="bananas">
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.queryByRole('menu')?.parentElement).toHaveClass(
    'OptionsMenu bananas'
  );
});

test('should support align prop', () => {
  render(
    <>
      <OptionsMenu trigger={trigger} align="left">
        <li>option 1</li>
        <li>option 2</li>
      </OptionsMenu>
      <OptionsMenu trigger={trigger} align="right">
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
  render(
    <OptionsMenu trigger={trigger} menuRef={menuRef}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(menuRef.current).toBeTruthy();
  expect(menuRef.current).toEqual(screen.getByRole('menu'));
});

test('should toggle menu on trigger clicks', async () => {
  const user = userEvent.setup();
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = screen.getByRole('button');

  await user.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'true');

  await user.click(button);

  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'false');
});

test('should click trigger with down key on trigger', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = screen.getByRole('button');

  fireEvent.keyDown(button, { keyCode: 40 });
  expect(button).toHaveAttribute('aria-expanded', 'true');
});

test('should focus trigger on close', async () => {
  const user = userEvent.setup();

  render(
    <OptionsMenu trigger={trigger}>
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

  render(
    <OptionsMenu trigger={trigger} onClose={onClose}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const option = screen.getByRole('menuitem');

  await user.click(option);

  expect(onClose).toBeCalled();
});

test('should close menu when click outside event occurs', async () => {
  const user = userEvent.setup();

  render(
    <>
      <button>Click me!</button>
      <OptionsMenu trigger={trigger}>
        <li className="foo">option 1</li>
      </OptionsMenu>
    </>
  );

  await user.click(screen.getByRole('button', { name: 'trigger' }));
  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'true');
  await user.click(screen.getByRole('button', { name: 'Click me!' }));
  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'false');
});

test('should return no axe violations when hidden', async () => {
  const { container } = render(
    <OptionsMenu trigger={trigger} show={false}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations when shown', async () => {
  const { container } = render(
    <OptionsMenu trigger={trigger} show={true}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});
