'use client';
import { Button, Checkbox, Code, useThemeContext } from '@deque/cauldron-react';

// A separate client module from the provider, so the theme only reaches it if
// both modules load the same copy of the package.
export default function Themed() {
  const { theme } = useThemeContext();
  return (
    <main>
      <span id="theme">{`theme:${theme}`}</span>
      <Button variant="primary">Save</Button>
      <Checkbox id="agree" label="Agree" />
      <Code language="javascript">const a = 1;</Code>
    </main>
  );
}
