import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Scrim from './';
import axe from '../../axe';

test('should fade scrim in when initial truthy show prop is provided', async () => {
  const { container } = render(<Scrim show={true} />);

  expect(container.querySelector('.Scrim')).toHaveClass('Scrim--show');
  await waitFor(() => {
    expect(container.querySelector('.Scrim')).toHaveClass(
      'Scrim--show Scrim--fade-in'
    );
  });
});

test('should call fadeIn when show prop updates from falsey to truthy', async () => {
  const { container, rerender } = render(<Scrim show={false} />);

  expect(container.querySelector('.Scrim')).toBeNull();

  rerender(<Scrim show={true} />);

  expect(container.querySelector('.Scrim')).toHaveClass('Scrim--show');
  await waitFor(() => {
    expect(container.querySelector('.Scrim')).toHaveClass(
      'Scrim--show Scrim--fade-in'
    );
  });
});

test('should call fadeOut when show prop updates from truthy to falsey', async () => {
  const { container, rerender } = render(<Scrim show={true} />);

  await waitFor(() => {
    expect(container.querySelector('.Scrim')).toHaveClass(
      'Scrim--show Scrim--fade-in'
    );
  });

  rerender(<Scrim show={false} />);

  await waitFor(() => {
    expect(container.querySelector('.Scrim')).toBeNull();
  });
});

test('should return null when given a falsey show prop', () => {
  const { container } = render(<Scrim show={false} />);
  expect(container.querySelector('.Scrim')).toBeNull();
});

test('returns no axe violations', async () => {
  const { container } = render(<Scrim show={true} />);
  expect(await axe(container)).toHaveNoViolations();
});
