import React from 'react';
import { SinonStub, createSandbox } from 'sinon';
import {
  default as TwoColumnPanel,
  ColumnLeft,
  ColumnRight,
  ColumnHeader
} from './';
import SkipLink from '../SkipLink';
import axe from '../../axe';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const sandbox = createSandbox();
const mediaAddEventListener = sandbox.stub();
const mediaRemoveEventListener = sandbox.stub();
const noop = () => {
  // not empty
};
const matchMedia = {
  matches: false,
  addEventListener: mediaAddEventListener,
  removeEventListener: mediaRemoveEventListener
};

let matchMediaStub: SinonStub;

beforeEach(() => {
  window.matchMedia = window.matchMedia || noop;
  matchMediaStub = sandbox
    .stub(window, 'matchMedia')
    .returns(matchMedia as unknown as MediaQueryList);
});

afterEach(() => {
  sandbox.restore();
});

test('should render TwoColumnPanel', () => {
  render(
    <TwoColumnPanel
      data-testid="two-column-panel"
      hideCollapsedPanelLabel="test-hide-panel"
    >
      <ColumnLeft
        aria-labelledby="test-aria-labelledby"
        data-testid="column-left"
        id="column-left-id"
      >
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight
        aria-labelledby="test-aria-labelledby"
        data-testid="column-right"
      >
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  const twoColumnPanel = screen.getByTestId('two-column-panel');
  expect(twoColumnPanel).toBeInTheDocument();
  expect(twoColumnPanel).toHaveClass('TwoColumnPanel');

  expect(screen.getByTestId('column-left')).toBeInTheDocument();

  const columnRight = screen.getByTestId('column-right');
  expect(columnRight).toBeInTheDocument();

  const columnRightToggleButton = within(columnRight).getByRole('button', {
    name: /test-hide-panel/i
  });

  expect(columnRightToggleButton).toBeInTheDocument();
  expect(columnRightToggleButton).toHaveAttribute('aria-expanded', 'true');
  expect(columnRightToggleButton).toHaveAttribute(
    'aria-controls',
    'column-left-id'
  );
});

test('should render collapsed TwoColumnPanel', () => {
  matchMediaStub.withArgs('(max-width: 45rem)').returns({
    matches: true,
    addEventListener: noop,
    removeEventListener: noop
  } as unknown as MediaQueryList);

  render(
    <TwoColumnPanel
      data-testid="two-column-panel"
      hideCollapsedPanelLabel="test-hide-panel"
    >
      <ColumnLeft
        aria-labelledby="test-aria-labelledby"
        data-testid="column-left"
        id="column-left-id"
      >
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight
        aria-labelledby="test-aria-labelledby"
        data-testid="column-right"
      >
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  const twoColumnPanel = screen.getByTestId('two-column-panel');
  expect(twoColumnPanel).toBeInTheDocument();
  expect(twoColumnPanel).toHaveClass('TwoColumnPanel');

  expect(screen.queryByTestId('column-left')).not.toBeInTheDocument();

  const columnRight = screen.getByTestId('column-right');
  expect(columnRight).toBeInTheDocument();

  const columnRightToggleButton = within(columnRight).queryByRole('button', {
    name: /test-hide-panel/i
  });

  expect(columnRightToggleButton).not.toBeInTheDocument();
});

test('should collapse panel when prefers-reduced-motion: reduce is set', async () => {
  matchMediaStub.withArgs('(prefers-reduced-motion: reduce)').returns({
    matches: true,
    addEventListener: noop,
    removeEventListener: noop
  });

  render(
    <TwoColumnPanel
      data-testid="two-column-panel"
      hideCollapsedPanelLabel="test-hide-panel"
    >
      <ColumnLeft
        aria-labelledby="test-aria-labelledby"
        data-testid="column-left"
        id="column-left-id"
      >
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight
        aria-labelledby="test-aria-labelledby"
        data-testid="column-right"
      >
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  await userEvent.click(
    within(screen.getByTestId('column-right')).getByRole('button', {
      name: /test-hide-panel/
    })
  );

  expect(screen.queryByTestId('column-left')).not.toBeInTheDocument();
});

test('should render configurable collapsed TwoColumnPanel', () => {
  matchMediaStub.withArgs('(max-width: 999rem)').returns({
    matches: true,
    addEventListener: noop,
    removeEventListener: noop
  });

  render(
    <TwoColumnPanel
      data-testid="two-column-panel"
      hideCollapsedPanelLabel="test-hide-panel"
      showCollapsedPanelLabel="test-show-panel"
      collapsedMediaQuery="(max-width: 999rem)"
    >
      <ColumnLeft
        aria-labelledby="test-aria-labelledby"
        data-testid="column-left"
        id="column-left-id"
      >
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight
        aria-labelledby="test-aria-labelledby"
        data-testid="column-right"
      >
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  expect(screen.getByTestId('two-column-panel')).toBeInTheDocument();
  expect(screen.queryByTestId('column-left')).not.toBeInTheDocument();

  const columnRight = screen.getByTestId('column-right');
  expect(columnRight).toBeInTheDocument();

  expect(
    within(columnRight).getByRole('button', {
      name: /test-show-panel/i
    })
  ).toHaveAttribute('aria-expanded', 'false');
});

test('should accept a skip link', () => {
  render(
    <TwoColumnPanel
      data-testid="two-column-panel"
      hideCollapsedPanelLabel="test-hide-panel"
      showCollapsedPanelLabel="test-show-panel"
      skipLink={
        (
          <SkipLink
            target="#my-target"
            skipText="Test skip to"
            targetText="Test Content"
          />
        ) as unknown as SkipLink
      }
    >
      <ColumnLeft
        aria-labelledby="test-aria-labelledby"
        data-testid="column-left"
        id="column-left-id"
      >
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight
        aria-labelledby="test-aria-labelledby"
        data-testid="column-right"
      >
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  screen.getByRole('link', { name: /Test skip to Test content/i });
});

test('should return no axe violations', async () => {
  const { container } = render(
    <TwoColumnPanel
      data-testid="two-column-panel"
      hideCollapsedPanelLabel="test-hide-panel"
      showCollapsedPanelLabel="test-show-panel"
    >
      <ColumnLeft
        aria-labelledby="test-aria-labelledby"
        data-testid="column-left"
        id="column-left-id"
      >
        <ColumnHeader>Sidebar</ColumnHeader>
        <nav>
          <ul>
            <li>
              <a href="/one">1</a>
            </li>
            <li>
              <a href="/two">2</a>
            </li>
            <li>
              <a href="/three">3</a>
            </li>
          </ul>
        </nav>
      </ColumnLeft>
      <ColumnRight
        aria-labelledby="test-aria-labelledby"
        data-testid="column-right"
      >
        <ColumnHeader>Column Header</ColumnHeader>
        <div>1</div>
      </ColumnRight>
    </TwoColumnPanel>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
