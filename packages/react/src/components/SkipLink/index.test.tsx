import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SkipLink from './';
import axe from '../../axe';

type SkipLinkProps = {
  [key: string]: any;
};

const renderDefaultSkipLink = (props: SkipLinkProps = {}) => {
  return render(
    <SkipLink
      target="#main-content"
      skipText="Skip to"
      targetText="Main page content"
      {...props}
    />
  );
};

test('should focus main content when SkipLink is clicked', () => {
  expect.assertions(2);

  const target = window.document.createElement('div');
  target.id = 'main-content';
  window.document.body.appendChild(target);

  renderDefaultSkipLink();

  fireEvent.click(screen.getByRole('link'));

  expect(document.activeElement).toBe(target);
  expect(target.tabIndex).toBe(-1);
});

test('should render with correct skip link text and target text', () => {
  renderDefaultSkipLink();

  expect(screen.getByText(/Skip to/i)).toBeInTheDocument();
  expect(screen.getByText(/Main page content/i)).toBeInTheDocument();
});

test('should set currentClass state properly when SkipLink is focused', async () => {
  renderDefaultSkipLink();

  fireEvent.focus(screen.getByRole('link'));

  await waitFor(() => {
    expect(screen.getByRole('navigation')).toHaveClass(
      'SkipLink',
      'SkipLink--active'
    );
    expect(screen.getByRole('navigation')).toHaveClass(
      'SkipLink',
      'SkipLink--fade'
    );
  });
});

test('should set currentClass state properly when SkipLink loses focus', async () => {
  renderDefaultSkipLink();

  fireEvent.focus(screen.getByRole('link'));
  fireEvent.blur(screen.getByRole('link'));

  await waitFor(() => {
    expect(screen.getByRole('link')).not.toHaveClass('SkipLink--active');
    expect(screen.getByRole('link')).not.toHaveClass('SkipLink--fade');
  });
});

test('should pass props through to the nav element', () => {
  renderDefaultSkipLink({ 'aria-label': 'Skip to my lou' });

  expect(screen.getByRole('navigation')).toHaveAttribute(
    'aria-label',
    'Skip to my lou'
  );
});

test('should return no axe violations', async () => {
  const { container } = renderDefaultSkipLink();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
