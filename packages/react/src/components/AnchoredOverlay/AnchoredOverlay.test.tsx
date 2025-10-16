import React from 'react';
import {
  act,
  findByTestId,
  render,
  screen,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnchoredOverlay from './';
import axe from '../../axe';

jest.mock('@floating-ui/react-dom', () => {
  const actual = jest.requireActual('@floating-ui/react-dom');
  return {
    ...actual,
    detectOverflow: jest.fn()
  };
});

import { detectOverflow } from '@floating-ui/react-dom';

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

test('should call onShiftChange with initial shift position', () => {
  const targetRef = { current: document.createElement('button') };
  const onShiftChange = jest.fn();

  render(
    <AnchoredOverlay
      target={targetRef}
      placement="top"
      open
      onShiftChange={onShiftChange}
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );

  expect(onShiftChange).toHaveBeenCalledWith({ x: 0, y: 0 });
});

test('should not trap focus when focusTrap is false', async () => {
  const targetRef = { current: document.createElement('button') };
  const user = userEvent.setup();

  render(
    <>
      <button>Outside Before</button>
      <AnchoredOverlay target={targetRef} open focusTrap={false}>
        <button>Inside</button>
      </AnchoredOverlay>
      <button>Outside After</button>
    </>
  );

  const buttons = screen.getAllByRole('button');

  buttons[0].focus();
  expect(buttons[0]).toHaveFocus();
  await user.tab();
  expect(buttons[1]).toHaveFocus();
  await user.tab();
  expect(buttons[2]).toHaveFocus();
});

test('should trap focus when focusTrap is true', async () => {
  const targetRef = { current: document.createElement('button') };
  const user = userEvent.setup();

  render(
    <>
      <button>Outside Before</button>
      <AnchoredOverlay target={targetRef} open focusTrap data-testid="overlay">
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </AnchoredOverlay>
      <button>Outside After</button>
    </>
  );

  const buttons = within(screen.getByTestId('overlay')).getAllByRole('button');

  expect(buttons[0]).toHaveFocus();
  await user.tab();
  expect(buttons[1]).toHaveFocus();
  await user.tab();
  expect(buttons[2]).toHaveFocus();
  await user.tab();
  expect(buttons[0]).toHaveFocus();
});

test('should restore focus when focusTrap is unmounted', async () => {
  const targetRef = { current: document.createElement('button') };
  const outsideButton = document.createElement('button');
  document.body.appendChild(outsideButton);
  outsideButton.focus();

  const { unmount } = render(
    <AnchoredOverlay target={targetRef} open focusTrap data-testid="overlay">
      <button>Inside Button</button>
    </AnchoredOverlay>
  );

  expect(screen.getByText('Inside Button')).toHaveFocus();
  unmount();
  expect(outsideButton).toHaveFocus();

  document.body.removeChild(outsideButton);
});

test('should support when overlay overflows top of document', async () => {
  const targetRef = { current: document.createElement('button') };
  const onShiftChange = jest.fn();
  render(
    <AnchoredOverlay
      data-testid="overlay"
      target={targetRef}
      open
      onShiftChange={onShiftChange}
    >
      <button>Inside Button</button>
    </AnchoredOverlay>
  );

  (detectOverflow as jest.Mock).mockResolvedValue({
    top: 10, // provide positive value to indicate overflow above document,
    right: 0,
    bottom: 0,
    left: 0
  });

  expect(screen.getByTestId('overlay')).toBeInTheDocument();
});

test('should support when overlay remains below top of document', async () => {
  const targetRef = { current: document.createElement('button') };
  const onShiftChange = jest.fn();
  render(
    <AnchoredOverlay
      data-testid="overlay"
      target={targetRef}
      open
      onShiftChange={onShiftChange}
    >
      <button>Inside Button</button>
    </AnchoredOverlay>
  );

  (detectOverflow as jest.Mock).mockResolvedValue({
    top: -10, // provide negative value to indicate overflow below document
    right: 0,
    bottom: 0,
    left: 0
  });

  expect(screen.getByTestId('overlay')).toBeInTheDocument();
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

test('should support portal prop', async () => {
  const targetRef = { current: document.createElement('button') };
  const portal = document.createElement('div');

  render(
    <AnchoredOverlay
      target={targetRef}
      portal={portal}
      open
      data-testid="overlay"
    >
      Content
    </AnchoredOverlay>
  );

  const anchoredOverlayInPortal = await findByTestId(portal, 'overlay');
  expect(anchoredOverlayInPortal).toBeTruthy();
});

test('should return no axe violations when opened', async () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay target={targetRef} open data-testid="overlay">
      Content
    </AnchoredOverlay>
  );

  await act(async () => {
    const results = await axe(screen.getByTestId('overlay'));
    expect(results).toHaveNoViolations();
  });
});

test('should return no axe violations when not open', async () => {
  const targetRef = { current: document.createElement('button') };
  render(
    <AnchoredOverlay target={targetRef} data-testid="overlay">
      Content
    </AnchoredOverlay>
  );

  await act(async () => {
    const results = await axe(screen.getByTestId('overlay'));
    expect(results).toHaveNoViolations();
  });
});
