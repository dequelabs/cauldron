import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OptionsMenu from './';
import axe from '../../axe';

const trigger = (props: any) => (
  <button type="button" {...props}>
    foo
  </button>
);

test('should render children', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('should render trigger prop', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('should pass className through', () => {
  render(
    <OptionsMenu trigger={trigger} className="foo bar">
      <li>option 1</li>
      <li>option 2</li>
    </OptionsMenu>
  );

  expect(screen.getByRole('button').parentElement).toHaveClass('foo bar');
});

test('should toggle menu on trigger clicks', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('menu')).toHaveAttribute('aria-expanded', 'false');
});

test('should click trigger with down key on trigger', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  fireEvent.keyDown(screen.getByRole('button'), { keyCode: 40 });
  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
});

test('should focus trigger on close', () => {
  render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const button = screen.getByRole('button');

  fireEvent.click(button);
  fireEvent.click(button); // to close
  expect(button).toHaveFocus();
});

test('should call onClose when closed', () => {
  const onClose = jest.fn();

  render(
    <OptionsMenu trigger={trigger} onClose={onClose}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  const option = screen.getByRole('menuitem');

  fireEvent.click(option);

  expect(onClose).toBeCalled();
});

test('should return no axe violations', async () => {
  const { container } = render(
    <OptionsMenu trigger={trigger}>
      <li className="foo">option 1</li>
    </OptionsMenu>
  );

  expect(await axe(container)).toHaveNoViolations();
});
