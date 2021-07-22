import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { ThemeProvider, useThemeContext } from 'src/contexts/theme';

let theme, toggleTheme, observe, disconnect, trigger;

global.MutationObserver = class MutationObserver {
  constructor(handler) {
    this.observe = sinon.spy();
    this.disconnect = sinon.spy();
    // add a trigger method so we can simulate a mutation
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

const mountWrapper = (themeProviderProps = {}) => {
  return mount(
    <ThemeProvider {...themeProviderProps}>
      <ThemeTester />
    </ThemeProvider>
  );
};

test('it exposes the current theme (defaulting to light)', () => {
  mountWrapper();
  expect(theme).toBe('light');
});

test('it provides toggleTheme functionality', () => {
  mountWrapper();
  expect(theme).toBe('light');
  act(() => toggleTheme());
  expect(theme).toBe('dark');
  act(() => toggleTheme());
  expect(theme).toBe('light');
});

test('handles mutations', () => {
  mountWrapper();
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
    ])
  );
  expect(theme).toBe('dark');
});

test('disconnects mutation observer when unmounted', () => {
  const wrapper = mountWrapper();
  wrapper.unmount();
  expect(disconnect.called).toBe(true);
});
