import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge, { BadgeLabel } from '../../../src/components/Badge';
import axe from '../../axe';

test('renders children', () => {
  render(
    <Badge>
      <BadgeLabel>Label:</BadgeLabel> value
    </Badge>
  );
  expect(screen.getByText('Label:')).toBeInTheDocument();
});

test('passes classNames through', () => {
  render(
    <Badge className="baz">
      <BadgeLabel className="jazz">Badge:</BadgeLabel>
      hi
    </Badge>
  );
  expect(screen.getByText('hi')).toHaveClass('baz');
  expect(screen.getByText('Badge:')).toHaveClass('jazz');
});

test('passes arbitrary props through', () => {
  render(
    <Badge data-foo="true">
      <BadgeLabel data-bar="yes">hi</BadgeLabel>
      bye
    </Badge>
  );
  expect(screen.getByText('bye')).toHaveAttribute('data-foo', 'true');
  expect(screen.getByText('hi')).toHaveAttribute('data-bar', 'yes');
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Badge>
      <BadgeLabel>Label:</BadgeLabel> value
    </Badge>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
