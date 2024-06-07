import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PanelTrigger } from './';
import axe from '../../axe';

test('should render children', () => {
  render(
    <PanelTrigger>
      <div>Hello World</div>
    </PanelTrigger>
  );

  expect(screen.getByRole('button')).toHaveTextContent('Hello World');
});

test('should render functional children', () => {
  const fn = ({ open }: { open: boolean }) => (open ? 'Open' : 'Closed');
  const { rerender } = render(<PanelTrigger open>{fn}</PanelTrigger>);

  expect(screen.getByRole('button')).toHaveTextContent('Open');

  rerender(<PanelTrigger open={false}>{fn}</PanelTrigger>);

  expect(screen.getByRole('button')).toHaveTextContent('Closed');
});

test('should pass-through props allowed in its extended type', () => {
  render(<PanelTrigger type="submit" />);

  expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
});

test('should handle onclick', () => {
  const handleClick = jest.fn();

  render(<PanelTrigger onClick={handleClick}>Click Me</PanelTrigger>);

  fireEvent.click(screen.getByRole('button'));

  expect(handleClick).toBeCalled();
});

test('should render default trigger icons', () => {
  const { rerender } = render(<PanelTrigger />);

  expect(screen.getByRole('button').lastChild).toHaveClass(
    'Icon',
    'Icon--chevron-right',
    'Icon__right'
  );

  rerender(<PanelTrigger open />);

  expect(screen.getByRole('button').lastChild).toHaveClass(
    'Icon',
    'Icon--chevron-down',
    'Icon__down'
  );
});

test('should render custom trigger icons', () => {
  const { rerender } = render(
    <PanelTrigger iconExpanded="triangle-down" iconCollapsed="triangle-right" />
  );

  expect(screen.getByRole('button').lastChild).toHaveClass(
    'Icon',
    'Icon--triangle-right',
    'Icon__right'
  );

  rerender(
    <PanelTrigger
      open
      iconExpanded="triangle-down"
      iconCollapsed="triangle-right"
    />
  );

  expect(screen.getByRole('button').lastChild).toHaveClass(
    'Icon',
    'Icon--triangle-down',
    'Icon__down'
  );
});

test('should return no axe violations with open prop', async () => {
  const { container } = render(<PanelTrigger open>Test</PanelTrigger>);

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations without open prop', async () => {
  const { container } = render(<PanelTrigger>Test</PanelTrigger>);

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations with custom icons and with open prop', async () => {
  const { container } = render(
    <PanelTrigger
      open
      iconExpanded="triangle-down"
      iconCollapsed="triangle-right"
    >
      Test
    </PanelTrigger>
  );

  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations with custom icons and without open prop', async () => {
  const { container } = render(
    <PanelTrigger iconExpanded="triangle-down" iconCollapsed="triangle-right">
      Test
    </PanelTrigger>
  );

  expect(await axe(container)).toHaveNoViolations();
});
