import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import { useDarkMode } from '../hooks/useDarkMode';

const Page: NextPageWithLayout = () => {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <>
      <h1>Testing</h1>
      <Link href="/accordion">Accordion documentation</Link>
      <p>Current theme: {isDarkMode ? 'dark' : 'light'}</p>
      <p>Ternary Dark Mode: {isDarkMode}</p>
      <button type="button" onClick={toggle}>
        toggle
      </button>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
