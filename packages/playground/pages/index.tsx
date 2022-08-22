import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useTernaryDarkMode } from '../hooks/useTernaryDarkMode';

const Page: NextPageWithLayout = () => {
  const {
    isDarkMode,
    toggleTernaryDarkMode,
    ternaryDarkMode
  } = useTernaryDarkMode();

  return (
    <>
      <h1>Testing</h1>
      <Link href="/accordion">Accordion documentation</Link>
      <p>Current theme: {isDarkMode ? 'dark' : 'light'}</p>
      <p>Ternary Dark Mode: {ternaryDarkMode}</p>
      <button type="button" onClick={toggleTernaryDarkMode}>
        toggle
      </button>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
