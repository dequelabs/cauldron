import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useMnemonics from './useMnemonics';

const TestComponent = ({
  onMatch,
  enabled,
  matchingElementsSelector
}: Parameters<typeof useMnemonics>[0]) => {
  const containerRef = useMnemonics<HTMLDivElement>({
    matchingElementsSelector,
    onMatch,
    enabled
  });

  return (
    <div ref={containerRef} data-testid="container" tabIndex={-1}>
      <button>Apple</button>
      <button>Banana</button>
      <a href="/fruit">Blueberry</a>
      <button>Carrot</button>
      <button>Cantaloupe</button>
      <button>Cherry</button>
      <button aria-label="Date">📅</button>
      <button>1234</button>
      <div>Not a fruit</div>
    </div>
  );
};

describe('useMnemonics', () => {
  test('should match first element when pressing a matching letter', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();
    await user.keyboard('a');

    expect(onMatch).toHaveBeenCalledWith(screen.getByText('Apple'));
  });

  test('should cycle through matching elements on repeated key press', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();

    await user.keyboard('b');
    expect(onMatch).toHaveBeenLastCalledWith(screen.getByText('Banana'));
    await user.keyboard('b');
    expect(onMatch).toHaveBeenLastCalledWith(screen.getByText('Blueberry'));
    await user.keyboard('b');
    expect(onMatch).toHaveBeenLastCalledWith(screen.getByText('Banana'));
  });

  test('should handle case-insensitive matching', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();
    await user.keyboard('A');

    expect(onMatch).toHaveBeenCalledTimes(1);
    expect(onMatch).toHaveBeenCalledWith(screen.getByText('Apple'));
  });

  test('should match aria-label when set', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();
    await user.keyboard('d');

    expect(onMatch).toHaveBeenCalledWith(
      screen.getByRole('button', { name: 'Date' })
    );
  });

  test('should match numbers', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();
    await user.keyboard('1');

    expect(onMatch).toHaveBeenCalledWith(screen.getByText('1234'));
  });

  test('should ignore non-alphanumeric keys', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.keyboard('{Tab}');
    await user.keyboard('{Escape}');
    await user.keyboard('!');
    await user.keyboard('@');
    await user.keyboard('#');
    await user.keyboard('$');

    expect(onMatch).not.toHaveBeenCalled();
  });

  test('should ignore keys with modifiers', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();

    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('{Alt>}a{/Alt}');
    await user.keyboard('{Meta>}a{/Meta}');

    expect(onMatch).not.toHaveBeenCalled();
  });

  test('should reset active element when no matches found', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} />);
    const container = screen.getByTestId('container');

    container.focus();

    await user.keyboard('a');
    expect(onMatch).toHaveBeenCalledTimes(1);

    // Search for non-existent match
    await user.keyboard('z');
    expect(onMatch).toHaveBeenCalledTimes(1);

    await user.keyboard('a');
    expect(onMatch).toHaveBeenCalledTimes(2);
    expect(onMatch).toHaveBeenLastCalledWith(screen.getByText('Apple'));
  });

  test('should use custom selector when provided', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(
      <TestComponent onMatch={onMatch} matchingElementsSelector="a[href]" />
    );
    const container = screen.getByTestId('container');

    container.focus();

    await user.keyboard('b');
    expect(onMatch).toHaveBeenLastCalledWith(screen.getByText('Blueberry'));
  });

  test('should be match when enabled is false', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    render(<TestComponent onMatch={onMatch} enabled={false} />);
    const container = screen.getByTestId('container');

    container.focus();

    await user.keyboard('a');
    expect(onMatch).not.toHaveBeenCalled();
  });

  test('should not throw with no matches', async () => {
    const user = userEvent.setup();
    const EmptyComponent = () => {
      const containerRef = useMnemonics<HTMLDivElement>({
        onMatch: jest.fn()
      });
      return <div ref={containerRef} data-testid="empty" tabIndex={-1} />;
    };

    render(<EmptyComponent />);
    const container = screen.getByTestId('empty');

    container.focus();

    // Should not throw
    expect(async () => {
      await user.keyboard('a');
    }).not.toThrow();
  });

  test('should handle provided element', () => {
    const onMatch = jest.fn();
    const element = document.createElement('div');
    const child = document.createElement('button');
    element.tabIndex = -1;
    child.textContent = 'Apple';
    element.appendChild(child);

    const ElementContainer = () => {
      useMnemonics<HTMLDivElement>({
        elementOrRef: element,
        onMatch
      });
      return <div />;
    };

    render(<ElementContainer />);

    fireEvent.keyDown(element, { key: 'a' });
    expect(onMatch).toHaveBeenCalledWith(child);
  });

  test('should handle provided element ref', async () => {
    const user = userEvent.setup();
    const onMatch = jest.fn();
    const ComponentRef = () => {
      const containerRef = React.useRef<HTMLDivElement>(null);
      useMnemonics<HTMLDivElement>({
        elementOrRef: containerRef,
        onMatch
      });
      return (
        <div ref={containerRef} data-testid="container" tabIndex={-1}>
          <button>Apple</button>
        </div>
      );
    };

    render(<ComponentRef />);
    const container = screen.getByTestId('container');

    container.focus();
    await user.keyboard('a');

    expect(onMatch).toHaveBeenCalledWith(screen.getByText('Apple'));
  });
});
