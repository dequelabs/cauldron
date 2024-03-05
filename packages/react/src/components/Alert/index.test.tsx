import React from 'react';
import { render, screen } from '@testing-library/react';
import Alert from './';
import axe from '../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('should return null when passed a falsey "show" prop', () => {
  render(
    <Alert data-testid="alert" {...defaults}>
      Test Alert
    </Alert>
  );
  expect(screen.queryByTestId('alert')).toBeNull();
});

test('should show modal when passed a truthy "show" prop', () => {
  render(
    <Alert data-testid="alert" {...defaults} show>
      Test Alert
    </Alert>
  );
  expect(screen.getByTestId('alert')).toBeInTheDocument();
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Alert show heading="title">
      Hello!
    </Alert>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('should return no axe violations warning variant', async () => {
  const { container } = render(
    <Alert show variant="warning" heading="title">
      Hello!
    </Alert>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
