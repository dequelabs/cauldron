import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

interface ProviderProps {
  children: React.ReactNode;
  context?: HTMLElement;
  initialTheme?: string;
}

const LIGHT_THEME_CLASS = 'cauldron--theme-light';
const DARK_THEME_CLASS = 'cauldron--theme-dark';

const ThemeContext = createContext({});

const ThemeProvider = ({
  children,
  initialTheme = 'light',
  context
}: ProviderProps) => {
  if (typeof window === undefined) {
    return null;
  }

  const [theme, setTheme] = useState(initialTheme);
  const getThemeFromContext = () =>
    context?.classList.contains(DARK_THEME_CLASS) ? 'dark' : 'light';
  const toggleTheme = () =>
    setTheme(getThemeFromContext() === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    if (!context) {
      context = document.body;
    }
  }, []);

  useEffect(() => {
    context?.classList.toggle(LIGHT_THEME_CLASS, theme === 'light');
    context?.classList.toggle(DARK_THEME_CLASS, theme === 'dark');
  }, [context, theme]);

  // Use a MutationObserver to track changes to the classes outside of the context of React
  const handleMutation = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        setTheme(getThemeFromContext());
      }
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(handleMutation);
    if (!context) {
      return;
    }
    observer.observe(context, {
      childList: false,
      subtree: false,
      attributes: true
    });

    setTheme(getThemeFromContext());

    return () => observer.disconnect();
  }, [context]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

function useThemeContext() {
  return useContext(ThemeContext);
}

ThemeProvider.propTypes = {
  children: PropTypes.any,
  initialTheme: PropTypes.string
};

export { ThemeContext, ThemeProvider, useThemeContext };
