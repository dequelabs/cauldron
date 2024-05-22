import React, { RefObject } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LoaderOverlay from './';
import axe from '../../axe';

test('Should render LoaderOverlay with specified class, role, and label', () => {
  render(<LoaderOverlay className="baz" role="alert" label="loading" />);

  expect(screen.getByRole('alert')).toHaveClass('baz');
  expect(screen.getByRole('alert')).toHaveClass('Loader__overlay');
  expect(screen.getByRole('alert')).toHaveAttribute('role', 'alert');
});

test('Should focus on LoaderOverlay after initial render when focusOnInitialRender is true', async () => {
  render(
    <LoaderOverlay
      className="baz"
      role="alert"
      label="loading"
      focusOnInitialRender
    >
      Some text
    </LoaderOverlay>
  );

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveFocus();
  });
});

test('Should not have focus on LoaderOverlay after initial render without focusOnInitialRender', async () => {
  render(
    <LoaderOverlay className="baz" role="alert" label="loading">
      Some text
    </LoaderOverlay>
  );

  await waitFor(() => {
    expect(screen.getByRole('alert')).not.toHaveFocus();
  });
});

test('Should set LoaderOverlay ref and have expected class and role', () => {
  const loaderRef: RefObject<HTMLDivElement> = React.createRef();

  render(
    <LoaderOverlay className="baz" role="alert" label="loading" ref={loaderRef}>
      Some text
    </LoaderOverlay>
  );

  expect(loaderRef.current).toEqual(screen.getByRole('alert'));
  expect(loaderRef.current).toHaveClass('Loader__overlay');
  expect(loaderRef.current).toHaveClass('baz');
});

test('Should trap focus inside LoaderOverlay when focusTrap is enabled', async () => {
  render(
    <LoaderOverlay className="baz" role="alert" label="loading" focusTrap>
      Some text
    </LoaderOverlay>
  );

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveFocus();
  });
});

test('returns no axe violations', async () => {
  const { container } = render(<LoaderOverlay>Hello world</LoaderOverlay>);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
