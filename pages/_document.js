import Document, { Html, Head, Main, NextScript } from "next/document";
import Nav from "../components/Nav";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@itwasmattgregg" />
          <meta
            property="og:title"
            content="Yeasty Boys Sourdough Bread Lottery"
            key="title"
          />
          <meta
            property="og:description"
            content="Sign up to win the bread lottery and purchase merch!"
          />
          <meta
            property="og:image"
            content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/logo.png`}
          />
          <link rel="icon" href="/images/BreadEmoji.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Sora:wght@400;700&display=swap"
            rel="stylesheet"
          />
          {/* <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap"
          rel="stylesheet"
        /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
