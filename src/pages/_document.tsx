import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="DevPlaza" />
        <meta
          property="og:description"
          content="加入我们, 一起了解、参与、构建 DevPlaza"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />
        <meta property="og:image" content="" />
        <meta property="og:site_name" content="DevPlaza" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
