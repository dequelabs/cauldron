import classNames from 'classnames';
import { Html, Head, Main, NextScript } from 'next/document';
import { useTernaryDarkMode } from '../hooks/useTernaryDarkMode';

export default function Document() {
  const { isDarkMode } = useTernaryDarkMode();

  return (
    <Html lang="en">
      <Head />
      <body
        className={classNames(
          isDarkMode ? 'cauldron--theme-dark' : 'cauldron--theme-light'
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
