import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <h1>Testing</h1>
      <Link href="/accordion">Accordion documentation</Link>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
