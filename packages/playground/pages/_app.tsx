// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React from 'react';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import '@deque/cauldron-react/lib/cauldron.css';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(<Component {...pageProps} />);
}
