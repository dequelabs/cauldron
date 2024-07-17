import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import axe from '../../axe';
import Popover from '../Popover';
import AriaIsolate from '../../utils/aria-isolate';

let wrapperNode: HTMLDivElement | null;
let mountNode: HTMLElement | null;
beforeEach(() => {
  wrapperNode = document.createElement('div');
  wrapperNode.innerHTML = `
    <button>Click Me!</button>
    <div id="#mount"></div>
  `;
  document.body.appendChild(wrapperNode);
  mountNode = document.getElementById('mount');
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapperNode = null;
  mountNode = null;
});

const Wrapper = ({
  buttonProps = {},
  tooltipProps = {}
}: {
  buttonProps?: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps?: Omit<Partial<React.ComponentProps<typeof Popover>>, 'variant'>;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClose = jest.fn();

  return (
    <>
      <h2 id="popover-title">Popover title</h2>
      <button ref={ref} {...buttonProps}>
        button
      </button>
      <Popover
        variant="custom"
        show
        target={ref}
        onClose={onClose}
        aria-labelledby="popover-title"
        {...tooltipProps}
      >
        <div>
          <span>Popover content</span>
        </div>
      </Popover>
    </>
  );
};

const WrapperPopoverWithElements = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClose = jest.fn();
  return (
    <React.Fragment>
      <button ref={ref}>button</button>
      <Popover
        variant="custom"
        aria-labelledby="test-popover-title"
        target={ref}
        show
        onClose={onClose}
      >
        <div>
          <h2 id="test-popover-title">Popover title</h2>
          <button data-testid="foo1">Foo1</button>
          <button data-testid="foo2">Foo2</button>
          <button data-testid="foo3">Foo3</button>
        </div>
      </Popover>
    </React.Fragment>
  );
};

const WrapperPrompt = ({
  buttonProps = {},
  tooltipProps = {}
}: {
  buttonProps?: React.HTMLAttributes<HTMLButtonElement>;
  tooltipProps?: Omit<Partial<React.ComponentProps<typeof Popover>>, 'variant'>;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onClose = jest.fn();
  const onApply = jest.fn();

  return (
    <React.Fragment>
      <button {...buttonProps}>button</button>
      <Popover
        show
        variant="prompt"
        target={ref}
        infoText="popover info text"
        onApply={onApply}
        onClose={onClose}
        {...tooltipProps}
      />
    </React.Fragment>
  );
};

test('renders without blowing up', async () => {
  render(<Wrapper />);
  expect(screen.getByText('Popover content')).toBeTruthy();
});

test('should auto-generate id', async () => {
  render(<Wrapper />);
  const popover = screen.getByRole('dialog');
  const button = screen.getByText('button');
  expect(popover).toBeTruthy();
  const id = popover?.getAttribute('id');
  expect(id).toBeTruthy();
  expect(id).toEqual(button.getAttribute('aria-controls'));
});

test('should attach attribute aria-expanded correctly based on shown state', async () => {
  const { rerender } = render(<Wrapper />);

  expect(
    screen.queryByRole('button', {
      name: 'button',
      hidden: true,
      expanded: true
    })
  ).toBeInTheDocument();
  rerender(<Wrapper tooltipProps={{ show: false }} />);
  expect(
    screen.queryByRole('button', {
      name: 'button',
      hidden: false,
      expanded: false
    })
  ).toBeInTheDocument();
});

test('should support adding className to tooltip', async () => {
  render(<Wrapper tooltipProps={{ className: 'foo' }} />);
  const popover = screen.getByRole('dialog');
  expect(popover).toBeTruthy();
  expect(popover).toHaveClass('Popover');
  expect(popover).toHaveClass('foo');
});

test('should not overwrite user provided id and aria-describedby', async () => {
  const buttonProps = { 'aria-describedby': 'foo popoverid' };
  const tooltipProps = { id: 'popoverid' };
  render(<Wrapper buttonProps={buttonProps} tooltipProps={tooltipProps} />);
  const popover = screen.getByRole('dialog');
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
  const user = userEvent.setup();
  render(<Wrapper tooltipProps={{ onClose }} />, {
    container: mountNode as HTMLElement
  });
  const outsideButton = await screen.findByText(/Click Me!/i);
  expect(outsideButton).toBeTruthy();
  await user.click(outsideButton);
  await waitFor(() => expect(onClose).toBeCalled());
});

test('first element inside the popover container should have focus', async () => {
  render(<WrapperPopoverWithElements />);

  const firstElement = await screen.findByTestId('foo1');
  await waitFor(() => expect(firstElement).toHaveFocus());
});

test('should render two buttons (Apply/Close) for prompt variant', async () => {
  render(<WrapperPrompt />);
  const closeBtn = screen.getByText('Close');
  const applyBtn = screen.getByText('Apply');
  expect(closeBtn).toBeInTheDocument();
  expect(applyBtn).toBeInTheDocument();
});

test('onClose should be called, when close button in prompt popover is clicked', async () => {
  const handleClose = jest.fn();
  render(<WrapperPrompt tooltipProps={{ onClose: handleClose }} />);
  fireEvent.click(screen.getByText('Close'));
  await waitFor(() => expect(handleClose).toHaveBeenCalled());
});

test('onApply should be called, when apply button in prompt popover is clicked', async () => {
  const applyFunc = jest.fn();
  render(<WrapperPrompt tooltipProps={{ onApply: applyFunc }} />);
  fireEvent.click(screen.getByText('Apply'));
  await waitFor(() => expect(applyFunc).toHaveBeenCalled());
});

test('text for apply/close buttons are rendered correct', async () => {
  const closeButtonText = 'Specific text to close popover';
  const applyButtonText = 'Specific text to apply popover';
  render(<WrapperPrompt tooltipProps={{ closeButtonText, applyButtonText }} />);
  expect(screen.getByText(closeButtonText)).toBeInTheDocument();
  expect(screen.getByText(applyButtonText)).toBeInTheDocument();
});

test('variant="prompt" should return no axe violations', async () => {
  const { baseElement } = render(<WrapperPrompt />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('should return no axe violations when aria-label provided for variant="prompt"', async () => {
  const { baseElement } = render(
    <WrapperPrompt tooltipProps={{ 'aria-label': 'popover' }} />
  );
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('should return no axe violations when aria-label provided for variant="custom"', async () => {
  const Component = () => {
    const onClose = jest.fn();
    const target = useRef<HTMLButtonElement>(null);

    return (
      <Popover
        variant="custom"
        aria-label="popover"
        show
        target={target}
        onClose={onClose}
      >
        <div>
          <h2 id="popover-title">Popover Title</h2>
          <p>Popover content</p>
        </div>
      </Popover>
    );
  };

  const { baseElement } = render(<Component />);

  expect(await axe(baseElement)).toHaveNoViolations();
});

test('should have no axe violations when aria-labelledby provided for variant="custom"', async () => {
  const Component = () => {
    const onClose = jest.fn();
    const target = useRef<HTMLButtonElement>(null);

    return (
      <>
        <h2 id="popover-title">Popover Title</h2>
        <Popover
          variant="custom"
          aria-labelledby="popover-title"
          show
          target={target}
          onClose={onClose}
        >
          <div>
            <p>Popover content</p>
          </div>
        </Popover>
      </>
    );
  };

  const { baseElement } = render(<Component />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('should have no axe violations for prompt variant', async () => {
  const { baseElement } = render(<WrapperPrompt />);
  expect(await axe(baseElement)).toHaveNoViolations();
});

test('aria-labelleddby should exist for variant="custom"', async () => {
  render(<Wrapper />);

  const popover = screen.getByRole('dialog');
  const ariaLabelledById = popover.getAttribute('aria-labelledby');

  expect(ariaLabelledById).toBeTruthy();
});

test('aria-labelleddby should not exist if aria-label provided for variant="prompt"', async () => {
  render(
    <WrapperPrompt
      tooltipProps={{
        'aria-label': 'test-popover-title'
      }}
    />
  );

  const popover = screen.getByRole('dialog');
  const ariaLabelledById = popover.getAttribute('aria-labelledby');

  expect(ariaLabelledById).toBeNull();
});

test('should use parent-provided ref', () => {
  const parentRef = React.createRef<HTMLDivElement>();
  const ref = React.createRef<HTMLButtonElement>();
  const onClose = jest.fn();

  render(
    <Popover
      variant="custom"
      aria-labelledby="title-popover-title"
      ref={parentRef}
      target={ref}
      show
      onClose={onClose}
    >
      Hello World
    </Popover>
  );

  expect(parentRef.current).toBe(screen.getByRole('dialog'));
});

test('activates aria isolate on show', () => {
  const parentRef = React.createRef<HTMLDivElement>();
  const ref = React.createRef<HTMLButtonElement>();
  const onClose = jest.fn();

  const activateFn = jest.fn();
  const deactivateFn = jest.fn();

  jest.spyOn(AriaIsolate.prototype, 'activate').mockImplementation(activateFn);
  jest
    .spyOn(AriaIsolate.prototype, 'deactivate')
    .mockImplementation(deactivateFn);

  render(
    <Popover
      variant="custom"
      aria-labelledby="title-popover-title"
      ref={parentRef}
      target={ref}
      show
      onClose={onClose}
    >
      Hello World
    </Popover>
  );

  expect(activateFn).toBeCalled();

  jest.restoreAllMocks();
});

test('deactivates aria isolate on hide', () => {
  const parentRef = React.createRef<HTMLDivElement>();
  const ref = React.createRef<HTMLButtonElement>();
  const onClose = jest.fn();
  const activateFn = jest.fn();
  const deactivateFn = jest.fn();

  jest.spyOn(AriaIsolate.prototype, 'activate').mockImplementation(activateFn);
  jest
    .spyOn(AriaIsolate.prototype, 'deactivate')
    .mockImplementation(deactivateFn);

  const { rerender } = render(
    <Popover
      variant="custom"
      aria-labelledby="title-popover-title"
      ref={parentRef}
      target={ref}
      show
      onClose={onClose}
    >
      Hello World
    </Popover>
  );

  expect(activateFn).toBeCalled();

  rerender(
    <Popover
      variant="custom"
      aria-labelledby="title-popover-title"
      ref={parentRef}
      target={ref}
      show={false}
      onClose={onClose}
    >
      Hello World
    </Popover>
  );

  expect(deactivateFn).toBeCalled();
  jest.restoreAllMocks();
});

test('aria-labelledby is set correctly for prompt variant', async () => {
  render(<WrapperPrompt />);
  const popover = screen.getByRole('dialog', { name: /popover/i });
  expect(popover).toBeTruthy();
  const id = popover?.getAttribute('id');
  expect(`${id}-label`).toEqual(popover?.getAttribute('aria-labelledby'));
});
