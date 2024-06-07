import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { default as ExpandCollapsePanel, PanelTrigger } from './';
import { SinonStub, createSandbox } from 'sinon';
import * as stylesheets from '../../utils/stylesheets';

const sandbox = createSandbox();
const noop = () => {
  // not empty
};

let matchMediaStub: SinonStub;

beforeEach(() => {
  window.matchMedia = window.matchMedia || noop;
  matchMediaStub = sandbox.stub(window, 'matchMedia').returns({
    matches: false
  } as MediaQueryList);
});

afterEach(() => {
  jest.resetAllMocks();
  sandbox.restore();
});

export const isVisible = (element: HTMLElement): boolean => {
  const node = element.parentElement;
  if (!node) {
    throw new Error('Element has no parent');
  }
  // Assuming that the 'is--hidden' class is used to hide the element0и
  return !node.classList.contains('is--hidden');
};

test('should render children', () => {
  render(
    <ExpandCollapsePanel>
      <div>Hello World</div>
    </ExpandCollapsePanel>
  );

  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

test('should render multiple children', () => {
  render(
    <ExpandCollapsePanel>
      <div>blue</div>
      <div>green</div>
    </ExpandCollapsePanel>
  );

  expect(screen.getByText('blue')).toBeInTheDocument();
  expect(screen.getByText('green')).toBeInTheDocument();
});

test('should passthrough props', () => {
  const props = { foo: 'bar' };
  render(
    <ExpandCollapsePanel {...props}>
      <div data-testid="test-div" />
    </ExpandCollapsePanel>
  );

  const testDiv = screen.getByTestId('test-div');
  const parent = testDiv.parentElement;

  expect(parent).not.toBeNull();
  expect(parent).toHaveAttribute('foo', 'bar');
});

test('should have hidden content when collapsed', () => {
  render(
    <ExpandCollapsePanel>
      <div data-testid="test-div">foo</div>
    </ExpandCollapsePanel>
  );

  expect(isVisible(screen.getByTestId('test-div'))).toBeFalsy();
});

test('should have visible content when expanded', () => {
  render(
    <ExpandCollapsePanel open>
      <div data-testid="test-div">foo</div>
    </ExpandCollapsePanel>
  );

  expect(isVisible(screen.getByTestId('test-div'))).toBeTruthy();
});

test('should render PanelTrigger', () => {
  render(
    <ExpandCollapsePanel>
      <PanelTrigger data-testid="panel-trigger" />
    </ExpandCollapsePanel>
  );

  const trigger = screen.getByTestId('panel-trigger');

  expect(trigger).toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('should call onToggle when toggled', () => {
  const handleToggle = jest.fn();
  render(
    <ExpandCollapsePanel onToggle={handleToggle}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div />
    </ExpandCollapsePanel>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));

  expect(handleToggle).toHaveBeenCalledTimes(1);
});

test('trigger should open panel collapsed panel', async () => {
  render(
    <ExpandCollapsePanel animationTiming={1}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div data-testid="test-div" />
    </ExpandCollapsePanel>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));

  await waitFor(() => {
    expect(isVisible(screen.getByTestId('test-div'))).toBeTruthy();
  });
});

test('trigger should close expanded panel', async () => {
  const Component = ({ isOpen }: { isOpen: boolean }) => (
    <ExpandCollapsePanel animationTiming={1} open={isOpen}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div data-testid="test-div" />
    </ExpandCollapsePanel>
  );

  const { rerender, getByTestId } = render(<Component isOpen={true} />);

  rerender(<Component isOpen={false} />);

  await waitFor(() => {
    expect(isVisible(getByTestId('test-div'))).toBeFalsy();
  });
});

test('should clean up injected styletags', async () => {
  const cleanup = jest.spyOn(stylesheets, 'removeStyleTag');

  const { unmount } = render(
    <ExpandCollapsePanel animationTiming={1}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div />
    </ExpandCollapsePanel>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));

  unmount();

  await waitFor(() => {
    expect(cleanup).toBeCalled();
  });
});

test('should not run open animations if timing is not set', async () => {
  const setStyle = jest.spyOn(stylesheets, 'setStyle');

  render(
    <ExpandCollapsePanel animationTiming={0}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div data-testid="test-div" />
    </ExpandCollapsePanel>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));

  await waitFor(() => {
    expect(setStyle).not.toBeCalled();
    expect(isVisible(screen.getByTestId('test-div'))).toBeTruthy();
  });
});

test('should not run close animations if timing is not set', async () => {
  const setStyle = jest.spyOn(stylesheets, 'setStyle');

  render(
    <ExpandCollapsePanel animationTiming={0}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div data-testid="test-div" />
    </ExpandCollapsePanel>
  );

  fireEvent.doubleClick(screen.getByRole('button', { name: 'Click Me' }));

  await waitFor(() => {
    expect(setStyle).not.toBeCalled();
    expect(isVisible(screen.getByTestId('test-div'))).toBeFalsy();
  });
});

test.only('should allow for controlled component', () => {
  render(
    <ExpandCollapsePanel animationTiming={0} open>
      <PanelTrigger />
      <div data-testid="test-div" />
    </ExpandCollapsePanel>
  );

  expect(isVisible(screen.getByTestId('test-div'))).toBeTruthy();
});

test('should not run open/close animations when prefers reduced motion is enabled', async () => {
  const setStyle = jest.spyOn(stylesheets, 'setStyle');

  matchMediaStub
    .withArgs('(prefers-reduced-motion: reduce)')
    .returns({ matches: true });

  render(
    <ExpandCollapsePanel animationTiming={500}>
      <PanelTrigger>Click Me</PanelTrigger>
      <div data-testid="test-div">foo</div>
    </ExpandCollapsePanel>
  );

  // open animation
  fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));

  await waitFor(() => {
    expect(setStyle).not.toBeCalled();
    expect(isVisible(screen.getByTestId('test-div'))).toBeTruthy();
  });

  // close animation
  fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));

  await waitFor(() => {
    expect(setStyle).not.toBeCalled();
    expect(isVisible(screen.getByTestId('test-div'))).toBeFalsy();
  });
});
