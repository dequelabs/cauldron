import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TooltipTabstop from './';
import axe from '../../axe';

test('should successfully render without errors', async () => {
  render(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);

  await waitFor(() => {
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

test('should display tooltip on hover', async () => {
  render(<TooltipTabstop tooltip="World">Hello</TooltipTabstop>);

  await userEvent.hover(screen.getByText('Hello'));
  await waitFor(() => {
    expect(screen.getByText('World')).toBeInTheDocument();
  });
});

test(' should return no axe violations', async () => {
  const { container } = render(
    <TooltipTabstop tooltip="World">Hello</TooltipTabstop>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
