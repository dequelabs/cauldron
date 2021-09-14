import React from 'react';
import { useThemeContext } from '../../packages/react/lib';
import { Checkbox } from '@deque/cauldron-react/';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Checkbox
      label="Dark Theme"
      id="toggle-dark-light-theme"
      checked={theme === 'dark'}
      onChange={toggleTheme}
    />
  );
};

export default ThemeSelector;
