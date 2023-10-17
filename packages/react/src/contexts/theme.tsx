import React, { useState, useEffect, useContext, createContext } from 'react';

type Theme = 'light' | 'dark';

interface ProviderProps {
  children: React.ReactNode;
  context?: HTMLElement;
  initialTheme?: Theme;
}

const LIGHT_THEME_CLASS = 'cauldron--theme-light';
const DARK_THEME_CLASS = 'cauldron--theme-dark';

interface State {
  theme: Theme;
}

interface Methods {
  toggleTheme: () => void;
}

const ThemeContext = createContext<State & Methods>({
  theme: 'light',
  toggleTheme: () => {
    throw new Error('ThemeContext not initialized');
  }
});

const ThemeProvider = ({
  children,
  context = document.body,
  initialTheme = 'light'
}: ProviderProps) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const getThemeFromContext = () =>
    context.classList.contains(DARK_THEME_CLASS) ? 'dark' : 'light';
  const toggleTheme = () =>
    setTheme(getThemeFromContext() === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    context.classList.toggle(LIGHT_THEME_CLASS, theme === 'light');
    context.classList.toggle(DARK_THEME_CLASS, theme === 'dark');
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

export { ThemeContext, ThemeProvider, useThemeContext };
