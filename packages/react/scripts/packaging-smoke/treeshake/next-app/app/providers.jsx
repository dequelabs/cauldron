'use client';
import { ThemeProvider } from '@deque/cauldron-react';

export default function Providers({ children }) {
  return <ThemeProvider initialTheme="dark">{children}</ThemeProvider>;
}
