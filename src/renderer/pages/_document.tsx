import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { getCssText } from '~/renderer/css';

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: getCssText() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
