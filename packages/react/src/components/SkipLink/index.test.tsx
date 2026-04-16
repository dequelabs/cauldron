import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SkipLink from './';
import axe from '../../axe';

type SkipLinkProps = Record<string, unknown>;

let target: HTMLDivElement;

beforeEach(() => {
  target = window.document.createElement('div');
  target.id = 'main-content';
  window.document.body.appendChild(target);
});

afterEach(() => {
  window.document.body.removeChild(target);
});

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

test('should call preventDefault on click', () => {
  renderDefaultSkipLink();

  const defaultPrevented = !fireEvent.click(screen.getByRole('link'));

  expect(defaultPrevented).toBe(true);
});

test('should not activate the target element when clicked', () => {
  const handleClick = jest.fn();
  render(
    <>
      <SkipLink target="#interactive-target" />
      <button id="interactive-target" onClick={handleClick}>
        Target
      </button>
    </>
  );

  fireEvent.click(screen.getByRole('link'));

  const button = screen.getByRole('button', { name: 'Target' });
  expect(document.activeElement).toBe(button);
  expect(handleClick).not.toHaveBeenCalled();
});

test('should render with SkipLink--inline class when variant is inline', () => {
  renderDefaultSkipLink({ variant: 'inline' });

  expect(screen.getByRole('navigation')).toHaveClass(
    'SkipLink',
    'SkipLink--inline'
  );
});

test('should not render SkipLink--inline class by default', () => {
  renderDefaultSkipLink();

  expect(screen.getByRole('navigation')).toHaveClass('SkipLink');
  expect(screen.getByRole('navigation')).not.toHaveClass('SkipLink--inline');
});

test('inline variant should add active class on focus', async () => {
  renderDefaultSkipLink({ variant: 'inline' });

  fireEvent.focus(screen.getByRole('link'));

  await waitFor(() => {
    expect(screen.getByRole('navigation')).toHaveClass(
      'SkipLink',
      'SkipLink--inline',
      'SkipLink--active'
    );
  });
});

test('inline variant should apply position styles when position prop is provided', () => {
  renderDefaultSkipLink({
    variant: 'inline',
    position: { top: 10, left: 20 }
  });

  const nav = screen.getByRole('navigation');
  expect(nav).toHaveStyle({
    position: 'absolute',
    top: '10px',
    left: '20px'
  });
});

test('should return no axe violations', async () => {
  const { container } = renderDefaultSkipLink();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
