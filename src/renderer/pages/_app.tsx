import { AppProps } from 'next/app';
import Head from 'next/head';
import { normalizeStyles } from '~/renderer/styles/normalize';

export default function App({ Component, pageProps }: AppProps) {
  normalizeStyles();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
