import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <script
          defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDX6Ox-aNWq-VGn84ZRI82VbrKmlBMuypo&libraries=places&callback=initMap"
        />
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
