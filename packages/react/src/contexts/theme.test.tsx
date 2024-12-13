import React from 'react';
import { ThemeProvider, useThemeContext } from './theme';
import { render, act } from '@testing-library/react';

let theme: string,
  toggleTheme: () => void,
  observe: jest.Mock,
  disconnect: jest.Mock,
  trigger: (mutations: MutationRecord[]) => void;

global.MutationObserver = class {
  observe: jest.Mock;
  disconnect: jest.Mock;
  takeRecords: jest.Mock;
  trigger: (mutations: MutationRecord[]) => void;

  constructor(handler: any) {
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    this.takeRecords = jest.fn();
    this.trigger = handler;

    observe = this.observe;
    disconnect = this.disconnect;
    trigger = this.trigger;
  }
};

const ThemeTester = () => {
  const themeContext = useThemeContext();
  theme = themeContext.theme;
  toggleTheme = themeContext.toggleTheme;

  return <div />;
};

const renderProvider = (themeProviderProps = {}) => {
  return render(
    <ThemeProvider {...themeProviderProps}>
      <ThemeTester />
    </ThemeProvider>
  );
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('it exposes the current theme (defaulting to light)', () => {
  renderProvider();
  expect(theme).toBe('light');
  expect(document.body.classList.contains('cauldron--theme-light')).toBe(true);
});

test('it handles alternate contexts and initial themes', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  renderProvider({
    context: div,
    initialTheme: 'dark'
  });

  expect(div.classList.contains('cauldron--theme-dark')).toBe(true);
});

test('it provides toggleTheme functionality', () => {
  renderProvider();
  expect(theme).toBe('light');
  act(() => toggleTheme());
  expect(theme).toBe('dark');
  act(() => toggleTheme());
  expect(theme).toBe('light');
});

test('handles mutations', () => {
  renderProvider();
  expect(observe).toHaveBeenCalled();
  act(() => {
    document.body.classList.add('cauldron--theme-dark');
  });
  expect(theme).toBe('light');
  act(() =>
    trigger([
      {
        type: 'attributes',
        attributeName: 'class'
      }
    ] as MutationRecord[])
  );
  expect(theme).toBe('dark');
});

test('disconnects mutation observer when unmounted', () => {
  const { unmount } = renderProvider();
  unmount();
  expect(disconnect).toHaveBeenCalled();
});

test('throw an exception, without provider', () => {
  // react will log an error when the context throws, but we don't want it
  // to show up in our test output
  jest.spyOn(console, 'error').mockImplementation(jest.fn());

  const Component = () => {
    const { toggleTheme } = useThemeContext();
    toggleTheme();
    return <></>;
  };

  expect(() => {
    render(<Component />);
  }).toThrow();
});
