import React from 'react';
import { render, screen } from '@testing-library/react';
import axe from '../../axe';
import ImpactBadge from './';

test('should render critical `ImpactBadge`', () => {
  render(<ImpactBadge type="critical" />);
  expect(screen.getByText(/critical/i)).toHaveClass(
    'ImpactBadge',
    'ImpactBadge--critical',
    'Badge'
  );
});

test('should render serious `ImpactBadge`', () => {
  render(<ImpactBadge type="serious" />);
  expect(screen.getByText(/serious/i)).toHaveClass(
    'ImpactBadge',
    'ImpactBadge--serious',
    'Badge'
  );
});

test('should render moderate `ImpactBadge`', () => {
  render(<ImpactBadge type="moderate" />);
  expect(screen.getByText(/moderate/i)).toHaveClass(
    'ImpactBadge',
    'ImpactBadge--moderate',
    'Badge'
  );
});

test('should render minor `ImpactBadge`', () => {
  render(<ImpactBadge type="minor" />);
  expect(screen.getByText(/minor/i)).toHaveClass(
    'ImpactBadge',
    'ImpactBadge--minor',
    'Badge'
  );
});

test('passes classNames through', () => {
  render(<ImpactBadge type="critical" className="foo" />);
  expect(screen.getByText(/critical/i)).toHaveClass(
    'ImpactBadge',
    'ImpactBadge--critical',
    'Badge',
    'foo'
  );
});

test('passes arbitrary props through', () => {
  render(<ImpactBadge type="critical" data-foo="true" />);
  expect(screen.getByText(/critical/i)).toHaveAttribute('data-foo', 'true');
});

test('should render small `ImpactBadge`', () => {
  render(<ImpactBadge type="critical" size="small" />);
  const SmallBadge = screen.getByText(/critical/i);
  expect(SmallBadge).toHaveClass('ImpactBadge', 'Badge--small');
});

test('should render custom label', () => {
  render(<ImpactBadge type="critical" label="custom label" />);
  const CustomLabel = screen.getByText(/custom label/i);
  expect(CustomLabel).toBeInTheDocument();
  expect(screen.queryByText(/critical/i)).not.toBeInTheDocument();
});

test('should return no axe violations', async () => {
  const { container } = render(
    <>
      <ImpactBadge type="critical" />
      <ImpactBadge type="serious" />
      <ImpactBadge type="moderate" />
      <ImpactBadge type="minor" />

      <ImpactBadge type="critical" size="small" />
      <ImpactBadge type="serious" size="small" />
      <ImpactBadge type="moderate" size="small" />
      <ImpactBadge type="minor" size="small" />

      <ImpactBadge
        type="minor"
        size="small"
        label={'Custom Impact: Custom Minor'}
      />
    </>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
