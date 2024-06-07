import React from 'react';
import { render, screen } from '@testing-library/react';
import OptionsMenuTrigger from './OptionsMenuTrigger';
import axe from '../../axe';

const defaultOptionsMenuTrigger = () => {
  return render(
    <OptionsMenuTrigger data-testid="trigger">hi</OptionsMenuTrigger>
  );
};

test('should render children', () => {
  defaultOptionsMenuTrigger();

  expect(screen.getByTestId('trigger')).toHaveTextContent('hi');
});

test('should set [aria-haspopup=menu] on button', () => {
  defaultOptionsMenuTrigger();

  expect(screen.getByTestId('trigger')).toHaveAttribute(
    'aria-haspopup',
    'menu'
  );
});

test('returns no axe violations', async () => {
  const { container } = defaultOptionsMenuTrigger();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
