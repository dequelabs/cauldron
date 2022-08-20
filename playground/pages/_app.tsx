import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import { AppProps } from 'next/app';
import Layout from '../layouts/Layout';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
