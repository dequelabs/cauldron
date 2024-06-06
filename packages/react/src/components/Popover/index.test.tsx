import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from '../../axe';
import Popover from '../Popover';
import AriaIsolate from '../../utils/aria-isolate';

import type { PopoverProps } from '../Popover';

let wrapperNode: HTMLDivElement | null;
beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <button data-test>Click Me!</button>
    <div></div>
  `;
  document.body.appendChild(wrapperNode);
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapperNode = null;
});

const Wrapper = ({
  buttonProps = {},
  tooltipProps = {}
}: {
  buttonProps?: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps?: Partial<PopoverProps>;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Popover target={ref} show onClose={onClose} {...tooltipProps}>
        Hello World
      </Popover>
      <div data-test></div>
    </React.Fragment>
  );
};

const WrapperPopoverWithElements = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref}>button</button>
      <Popover target={ref} show onClose={onClose}>
        <button data-testid="foo1">Foo1</button>
        <button data-testid="foo2">Foo2</button>
        <button data-testid="foo3">Foo3</button>
      </Popover>
      <div data-testid></div>
    </React.Fragment>
  );
};

const WrapperPrompt = ({
  buttonProps = {},
  tooltipProps = {}
}: {
  buttonProps?: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps?: Partial<PopoverProps>;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Popover
        variant="prompt"
        target={ref}
        show
        onClose={onClose}
        infoText="popover"
        {...tooltipProps}
      />
    </React.Fragment>
  );
};

test('renders without blowing up', async () => {
  render(<Wrapper />);
  expect(screen.getByText('Hello World')).toBeTruthy();
});

test('should auto-generate id', async () => {
  render(<Wrapper />);
  const popover = screen.getByText('Hello World').closest('.Popover');
  const button = screen.getByText('button');
  expect(popover).toBeTruthy();
  const id = popover?.getAttribute('id');
  expect(id).toBeTruthy();
  expect(id).toEqual(button.getAttribute('aria-controls'));
});

test('should attach attribute aria-expanded correctly based on shown state', async () => {
  const { rerender } = render(<Wrapper />);
  const button = screen.getByText('button');
  expect(button.getAttribute('aria-expanded')).toBe('true');

  rerender(<Wrapper tooltipProps={{ show: false }} />);
  expect(button.getAttribute('aria-expanded')).toBe('false');
});

test('should support adding className to tooltip', async () => {
  render(<Wrapper tooltipProps={{ className: 'foo' }} />);
  const popover = screen.getByText('Hello World').closest('.Popover');
  expect(popover).toHaveClass('Popover');
  expect(popover).toHaveClass('foo');
});

test('should not overwrite user provided id and aria-describedby', async () => {
  const buttonProps = { 'aria-describedby': 'foo popoverid' };
  const tooltipProps = { id: 'popoverid' };
  render(<Wrapper buttonProps={buttonProps} tooltipProps={tooltipProps} />);
  const popover = screen.getByText('Hello World').closest('.Popover');
  const button = screen.getByText('button');
  expect(popover).toHaveAttribute('id', 'popoverid');
  expect(button.getAttribute('aria-describedby')).toEqual('foo popoverid');
});

test('should call onClose on escape keypress', async () => {
  const onClose = jest.fn();
  render(<Wrapper tooltipProps={{ onClose }} />);
  fireEvent.keyUp(document.body, { key: 'Escape' });
  await waitFor(() => expect(onClose).toBeCalled());
});

test('should call onClose on clicking outside', async () => {
  const onClose = jest.fn();
  render(<Wrapper tooltipProps={{ onClose }} />);
  const outsideButton = await screen.findByText(/Click Me!/i);
  expect(outsideButton).toBeTruthy();
  fireEvent.click(outsideButton);
  await waitFor(() => expect(onClose).toBeCalled());
});

test('first element inside the popover container should have focus', async () => {
  render(<WrapperPopoverWithElements />);
  const firstElement = screen.getByTestId('foo1');
  await waitFor(() => expect(firstElement).toHaveFocus());
});

test('should render two buttons (Apply/Close) for prompt variant', async () => {
  render(<Wrapper tooltipProps={{ variant: 'prompt' }} />);
  const closeBtn = screen.getByText('Close');
  const applyBtn = screen.getByText('Apply');
  expect(closeBtn).toBeInTheDocument();
  expect(applyBtn).toBeInTheDocument();
});

test('onClose should be called, when close button in prompt popover is clicked', async () => {
  const handleClose = jest.fn();
  render(
    <WrapperPrompt tooltipProps={{ variant: 'prompt', onClose: handleClose }} />
  );
  fireEvent.click(screen.getByText('Close'));
  await waitFor(() => expect(handleClose).toHaveBeenCalled());
});

test('onApply should be called, when apply button in prompt popover is clicked', async () => {
  const applyFunc = jest.fn();
  render(
    <WrapperPrompt tooltipProps={{ variant: 'prompt', onApply: applyFunc }} />
  );
  fireEvent.click(screen.getByText('Apply'));
  await waitFor(() => expect(applyFunc).toHaveBeenCalled());
});

test('text for apply/close buttons are rendered correct', async () => {
  const closeButtonText = 'Specific text to close popover';
  const applyButtonText = 'Specific text to apply popover';
  render(
    <WrapperPrompt
      tooltipProps={{ variant: 'prompt', closeButtonText, applyButtonText }}
    />
  );
  expect(screen.getByText(closeButtonText)).toBeInTheDocument();
  expect(screen.getByText(applyButtonText)).toBeInTheDocument();
});

test('variant="prompt" should return no axe violations', async () => {
  const { container } = render(<WrapperPrompt />);
  expect(await axe(container)).toHaveNoViolations();
});

test('should return no axe violations', async () => {
  const { container } = render(
    <Wrapper tooltipProps={{ variant: 'prompt', 'aria-label': 'popover' }} />
  );
  expect(await axe(container)).toHaveNoViolations();
});

test('should use parent-provided ref', () => {
  const parentRef = React.createRef<HTMLDivElement>();
  const ref = React.createRef<HTMLButtonElement>();
  const onClose = jest.fn();

  render(
    <Popover ref={parentRef} target={ref} show onClose={onClose}>
      Hello World
    </Popover>
  );
  expect(parentRef.current).toBe(
    screen.getByText('Hello World').closest('.Popover')
  );
});

test('activates aria isolate on show', () => {
  const parentRef = React.createRef();
  const ref = React.createRef<HTMLButtonElement>();
  const onClose = jest.fn();

  const activateFn = jest.fn();
  const deactivateFn = jest.fn();

  jest.spyOn(AriaIsolate.prototype, 'activate').mockImplementation(activateFn);
  jest
    .spyOn(AriaIsolate.prototype, 'deactivate')
    .mockImplementation(deactivateFn);

  render(
    <Popover ref={parentRef} target={ref} show onClose={onClose}>
      Hello World
    </Popover>
  );

  expect(activateFn).toBeCalled();

  jest.restoreAllMocks();
});

test('deactivates aria isolate on hide', () => {
  const parentRef = React.createRef();
  const ref = React.createRef<HTMLButtonElement>();
  const onClose = jest.fn();
  const activateFn = jest.fn();
  const deactivateFn = jest.fn();

  jest.spyOn(AriaIsolate.prototype, 'activate').mockImplementation(activateFn);
  jest
    .spyOn(AriaIsolate.prototype, 'deactivate')
    .mockImplementation(deactivateFn);

  const { rerender } = render(
    <Popover ref={parentRef} target={ref} show onClose={onClose}>
      Hello World
    </Popover>
  );

  expect(activateFn).toBeCalled();

  rerender(
    <Popover ref={parentRef} target={ref} show={false} onClose={onClose}>
      Hello World
    </Popover>
  );

  expect(deactivateFn).toBeCalled();
  jest.restoreAllMocks();
});

test('aria-labelledby is set correctly for prompt variant', async () => {
  render(<WrapperPrompt />);
  const popover = screen.getByText('popover').closest('.Popover');
  const id = popover?.getAttribute('id');
  expect(`${id}-label`).toEqual(popover?.getAttribute('aria-labelledby'));
});
