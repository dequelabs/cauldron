import React from 'react';
import { render, screen } from '@testing-library/react';
import Alert from './';
import axe from '../../axe';

const defaults = { show: false, heading: { text: 'hi' } };

test('should return null when passed a falsey "show" prop', () => {
  render(<Alert {...defaults}>Test Alert</Alert>);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('should pass classNames through', () => {
  render(
    <Alert {...defaults} show className="baz">
      Test Alert
    </Alert>
  );

  expect(screen.queryByRole('dialog')).toHaveClass('Alert', 'baz');
});

test('should pass ref prop through', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(
    <Alert {...defaults} show dialogRef={ref}>
      Test Alert
    </Alert>
  );

  expect(ref.current).toBeInTheDocument();
});

test('should show modal when passed a truthy "show" prop', () => {
  render(
    <Alert {...defaults} show>
      Test Alert
    </Alert>
  );

  expect(screen.queryByRole('dialog')).toBeInTheDocument();
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
