import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import TooltipTabstop from './';
import axe from '../../axe';

test('should render without errors', () => {
  render(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

test('should display tooltip on hover', async () => {
  render(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  act(() => {
    fireEvent.focusIn(screen.getByRole('button'));
  });
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  expect(await screen.findByRole('button')).toHaveAccessibleDescription(
    'World'
  );
});

test('should return no axe violations', async () => {
  const { container } = render(
    <TooltipTabstop tooltip="World">Hello</TooltipTabstop>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
