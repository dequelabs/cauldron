import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TooltipTabstop from './';
import axe from '../../axe';

test('should render without errors', () => {
  render(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

test('should display tooltip on hover', async () => {
  render(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await fireEvent.focusIn(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveAccessibleDescription('World');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <TooltipTabstop tooltip="World">Hello</TooltipTabstop>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
