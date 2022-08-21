import Layout from '../components/Layout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Page: NextPageWithLayout = () => {
  return <h1>Testing</h1>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
