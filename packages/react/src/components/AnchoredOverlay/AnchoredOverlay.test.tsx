import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnchoredOverlay from './';
import axe from '../../axe';

test('should render children', () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay target={targetRef} open data-testid="overlay">
      Hello World
    </AnchoredOverlay>
  );
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('should support className prop', () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay
      target={targetRef}
      className="custom"
      open
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );
  expect(screen.getByTestId('overlay')).toHaveClass('custom');
});

test('should support as prop for polymorphic rendering', () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay as="span" target={targetRef} open data-testid="overlay">
      Content
    </AnchoredOverlay>
  );
  expect(screen.getByTestId('overlay').tagName).toBe('SPAN');
});

test('should support auto placement', () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay
      target={targetRef}
      placement="auto"
      open
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );
  expect(screen.getByTestId('overlay')).toBeInTheDocument();
});

test('should support auto-start placement', () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay
      target={targetRef}
      placement="auto-start"
      open
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );
  expect(screen.getByTestId('overlay')).toBeInTheDocument();
});

test('should support auto-end placement', () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay
      target={targetRef}
      placement="auto-end"
      open
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );
  expect(screen.getByTestId('overlay')).toBeInTheDocument();
});

test('should call onOpenChange when escape is pressed', async () => {
  const targetRef = { current: document.createElement('button') };
  const onOpenChange = jest.fn();
  const user = userEvent.setup();

  render(
    <AnchoredOverlay
      target={targetRef}
      open
      onOpenChange={onOpenChange}
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );

  await user.keyboard('{Escape}');
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

test('should call onPlacementChange with initial placement', () => {
  const targetRef = { current: document.createElement('button') };
  const onPlacementChange = jest.fn();

  render(
    <AnchoredOverlay
      target={targetRef}
      placement="top"
      open
      onPlacementChange={onPlacementChange}
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );

  expect(onPlacementChange).toHaveBeenCalledWith('top');
});

test('should support ref prop', () => {
  const targetRef = { current: document.createElement('button') };
  const ref = React.createRef<HTMLDivElement>();

  render(
    <AnchoredOverlay ref={ref} target={targetRef} open data-testid="overlay">
      Content
    </AnchoredOverlay>
  );

  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toEqual(screen.getByTestId('overlay'));
});

test('should return no axe violations when opened', async () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay target={targetRef} open data-testid="overlay">
      Content
    </AnchoredOverlay>
  );

  const results = await axe(screen.getByTestId('overlay'));
  expect(results).toHaveNoViolations();
});

test('should return no axe violations when not open', async () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay target={targetRef} data-testid="overlay">
      Content
    </AnchoredOverlay>
  );

  const results = await axe(screen.getByTestId('overlay'));
  expect(results).toHaveNoViolations();
});
