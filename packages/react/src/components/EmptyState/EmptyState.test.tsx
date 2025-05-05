import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import EmptyState from './';

const defaultProps: React.ComponentProps<typeof EmptyState> = {
  heading: 'No items found',
  description: `Try adjusting your filters to find what you're looking for.`
};

test('should render empty state with string heading', () => {
  render(<EmptyState {...defaultProps} />);

  expect(
    screen.getByRole('heading', { name: 'No items found', level: 2 })
  ).toBeInTheDocument();
});

test('should render empty state with description', () => {
  render(<EmptyState {...defaultProps} />);

  expect(
    screen.getByText(
      `Try adjusting your filters to find what you're looking for.`
    )
  ).toBeInTheDocument();
});

test('should render empty state with custom heading element', () => {
  render(<EmptyState {...defaultProps} heading={<h3>Custom Heading</h3>} />);

  expect(
    screen.getByRole('heading', { name: 'Custom Heading', level: 3 })
  ).toBeInTheDocument();
});

test('should render with primary actions', () => {
  render(
    <EmptyState
      {...defaultProps}
      primaryActions={<button>Primary Action</button>}
    />
  );

  expect(
    screen.getByRole('button', { name: 'Primary Action' })
  ).toBeInTheDocument();
});

test('should render with secondary actions', () => {
  render(
    <EmptyState
      {...defaultProps}
      secondaryActions={<button>Secondary Action</button>}
    />
  );

  expect(
    screen.getByRole('button', { name: 'Secondary Action' })
  ).toBeInTheDocument();
});

test('should render with both primary and secondary actions', () => {
  render(
    <EmptyState
      {...defaultProps}
      primaryActions={<button>Primary Action</button>}
      secondaryActions={<button>Secondary Action</button>}
    />
  );

  expect(
    screen.getByRole('button', { name: 'Primary Action' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Secondary Action' })
  ).toBeInTheDocument();
});

test('should support ref prop', () => {
  const ref = createRef<HTMLDivElement>();

  render(<EmptyState {...defaultProps} data-testid="emptystate" ref={ref} />);

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.getByTestId('emptystate'));
});

test('should support custom className', () => {
  render(
    <EmptyState
      {...defaultProps}
      className="bananas"
      data-testid="emptystate"
    />
  );

  expect(screen.getByTestId('emptystate')).toHaveClass('EmptyState', 'bananas');
});

test('should support additional HTML attributes', () => {
  render(
    <EmptyState
      {...defaultProps}
      data-testid="empty-state"
      aria-label="Empty state component"
    />
  );

  const emptyStateElement = screen.getByTestId('empty-state');
  expect(emptyStateElement).toHaveAttribute(
    'aria-label',
    'Empty state component'
  );
});

test('should have no axe violations', async () => {
  const { container } = render(
    <EmptyState
      {...defaultProps}
      primaryActions={<button>Primary Action</button>}
      secondaryActions={<button>Secondary Action</button>}
    />
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
