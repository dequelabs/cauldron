import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Scrim from './';
import axe from '../../axe';

test('should fade scrim in when initial truthy show prop is provided', async () => {
  render(<Scrim show={true} />);

  expect(screen.getAllByRole('generic')[1]).toHaveClass('Scrim--show');
  await waitFor(() => {
    expect(screen.getAllByRole('generic')[1]).toHaveClass(
      'Scrim--show Scrim--fade-in'
    );
  });
});

test('should call fadeIn when show prop updates from falsey to truthy', async () => {
  const { rerender } = render(<Scrim show={false} />);

  expect(screen.getAllByRole('generic')[1]).toBeUndefined();

  rerender(<Scrim show={true} />);

  expect(screen.getAllByRole('generic')[1]).toHaveClass('Scrim--show');
  await waitFor(() => {
    expect(screen.getAllByRole('generic')[1]).toHaveClass(
      'Scrim--show Scrim--fade-in'
    );
  });
});

test('should call fadeOut when show prop updates from truthy to falsey', async () => {
  const { rerender } = render(<Scrim show={true} />);

  await waitFor(() => {
    expect(screen.getAllByRole('generic')[1]).toHaveClass(
      'Scrim--show Scrim--fade-in'
    );
  });

  rerender(<Scrim show={false} />);

  await waitFor(() => {
    expect(screen.getAllByRole('generic')[1]).toBeUndefined();
  });
});

test('should return null when given a falsey show prop', () => {
  render(<Scrim show={false} />);
  expect(screen.getAllByRole('generic')[1]).toBeUndefined();
});

test('returns no axe violations', async () => {
  const { container } = render(<Scrim show={true} />);
  expect(await axe(container)).toHaveNoViolations();
});
